import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Groups() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: groups, refetch } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner(
            role,
            profile_id
          ),
          creator:profiles!groups_creator_id_fkey(name, photo_url)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile,
  });

  const handleCreateGroup = async () => {
    if (!name.trim() || !profile) return;

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from("groups")
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          creator_id: profile.id,
        });

      if (error) throw error;

      toast.success("Group created successfully!");
      setName("");
      setDescription("");
      setOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Groups</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="md:h-10">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create Group</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleCreateGroup}
                  disabled={!name.trim() || isCreating}
                  className="w-full"
                >
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-3 md:gap-4 sm:grid-cols-2">
          {groups?.map((group) => (
            <Card
              key={group.id}
              className="p-4 md:p-6 cursor-pointer hover:shadow-lg transition-shadow active:scale-95"
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg md:text-xl font-semibold mb-1 truncate">{group.name}</h3>
                  {group.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{group.group_members?.length || 0} members</span>
                </div>
                <span>By {group.creator?.name}</span>
              </div>
            </Card>
          ))}
        </div>

        {groups?.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
            <p className="text-muted-foreground mb-4">Create your first group to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
