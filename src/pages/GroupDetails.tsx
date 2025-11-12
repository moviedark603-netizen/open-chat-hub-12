import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, UserPlus, Crown, Trash2 } from "lucide-react";

export default function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: currentProfile } = useQuery({
    queryKey: ["current-profile"],
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

  const { data: group, refetch } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("id", groupId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: members, refetch: refetchMembers } = useQuery({
    queryKey: ["group-members", groupId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_members")
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq("group_id", groupId);
      if (error) throw error;
      return data;
    },
    enabled: !!groupId,
  });

  const { data: availableProfiles } = useQuery({
    queryKey: ["available-profiles", groupId],
    queryFn: async () => {
      const memberIds = members?.map(m => m.profile_id) || [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .not("id", "in", `(${memberIds.join(",")})`);
      if (error) throw error;
      return data;
    },
    enabled: !!members,
  });

  const currentMember = members?.find(m => m.profile_id === currentProfile?.id);
  const isAdmin = currentMember?.role === "admin";

  const handleAddMember = async () => {
    if (!selectedProfile || !isAdmin) return;

    setIsAdding(true);
    try {
      const { error } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          profile_id: selectedProfile,
          role: "member",
        });

      if (error) throw error;

      toast.success("Member added successfully!");
      setSelectedProfile("");
      setOpen(false);
      refetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleAdmin = async (memberId: string, currentRole: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from("group_members")
        .update({ role: currentRole === "admin" ? "member" : "admin" })
        .eq("id", memberId);

      if (error) throw error;

      toast.success(`Member role updated to ${currentRole === "admin" ? "member" : "admin"}`);
      refetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from("group_members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      toast.success("Member removed successfully!");
      refetchMembers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/groups")}
          className="mb-4 md:mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Button>

        <Card className="p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{group?.name}</h1>
              {group?.description && (
                <p className="text-sm md:text-base text-muted-foreground">{group.description}</p>
              )}
            </div>
            {isAdmin && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="w-full sm:w-auto">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add Member</span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="member">Select Member</Label>
                      <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a member" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableProfiles?.map((profile) => (
                            <SelectItem key={profile.id} value={profile.id}>
                              {profile.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAddMember}
                      disabled={!selectedProfile || isAdding}
                      className="w-full"
                    >
                      Add Member
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </Card>

        <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Members</h2>
        <div className="space-y-2 md:space-y-3">
          {members?.map((member) => (
            <Card key={member.id} className="p-3 md:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarImage src={member.profile?.photo_url || ""} />
                    <AvatarFallback>
                      {member.profile?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm md:text-base truncate">{member.profile?.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                      {member.role === "admin" && <Crown className="h-3 w-3" />}
                      {member.role}
                    </p>
                  </div>
                </div>
                {isAdmin && member.profile_id !== currentProfile?.id && (
                  <div className="flex gap-1 md:gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleToggleAdmin(member.id, member.role)}
                      title="Toggle admin"
                    >
                      <Crown className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveMember(member.id)}
                      title="Remove member"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
