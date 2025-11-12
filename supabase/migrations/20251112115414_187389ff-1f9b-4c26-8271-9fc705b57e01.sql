-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  photo_url TEXT,
  creator_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT groups_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
);

-- Create group_members table
CREATE TABLE public.group_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  profile_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE,
  CONSTRAINT group_members_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT group_members_role_check CHECK (role IN ('member', 'admin')),
  UNIQUE(group_id, profile_id)
);

-- Enable RLS
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Groups are viewable by members"
ON public.groups FOR SELECT
USING (
  id IN (
    SELECT group_id FROM public.group_members 
    WHERE profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can create groups"
ON public.groups FOR INSERT
WITH CHECK (
  creator_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Group admins can update groups"
ON public.groups FOR UPDATE
USING (
  id IN (
    SELECT group_id FROM public.group_members 
    WHERE profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
    AND role = 'admin'
  )
);

CREATE POLICY "Group creators can delete groups"
ON public.groups FOR DELETE
USING (
  creator_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Group members policies
CREATE POLICY "Group members are viewable by other members"
ON public.group_members FOR SELECT
USING (
  group_id IN (
    SELECT group_id FROM public.group_members 
    WHERE profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Group admins can add members"
ON public.group_members FOR INSERT
WITH CHECK (
  group_id IN (
    SELECT group_id FROM public.group_members 
    WHERE profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
    AND role = 'admin'
  )
  OR
  group_id IN (
    SELECT id FROM public.groups 
    WHERE creator_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Group admins can update member roles"
ON public.group_members FOR UPDATE
USING (
  group_id IN (
    SELECT group_id FROM public.group_members 
    WHERE profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
    AND role = 'admin'
  )
);

CREATE POLICY "Group admins can remove members"
ON public.group_members FOR DELETE
USING (
  group_id IN (
    SELECT group_id FROM public.group_members 
    WHERE profile_id IN (
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
    AND role = 'admin'
  )
  OR
  profile_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Admins can view all groups and members
CREATE POLICY "Admins can view all groups"
ON public.groups FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all group members"
ON public.group_members FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.groups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;

-- Create function to automatically add creator as admin when group is created
CREATE OR REPLACE FUNCTION public.add_creator_as_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.group_members (group_id, profile_id, role)
  VALUES (NEW.id, NEW.creator_id, 'admin');
  RETURN NEW;
END;
$$;

-- Create trigger to add creator as admin
CREATE TRIGGER on_group_created
AFTER INSERT ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.add_creator_as_admin();