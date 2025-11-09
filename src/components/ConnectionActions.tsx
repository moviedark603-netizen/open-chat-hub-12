import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Ban, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ConnectionActionsProps {
  profileId: string;
  currentProfileId: string;
}

const ConnectionActions = ({ profileId, currentProfileId }: ConnectionActionsProps) => {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConnectionStatus();

    const channel = supabase
      .channel("connection-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profile_connections",
        },
        () => {
          fetchConnectionStatus();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, currentProfileId]);

  const fetchConnectionStatus = async () => {
    const { data } = await supabase
      .from("profile_connections")
      .select("status")
      .or(
        `and(requester_id.eq.${currentProfileId},receiver_id.eq.${profileId}),and(requester_id.eq.${profileId},receiver_id.eq.${currentProfileId})`
      )
      .single();

    setConnectionStatus(data?.status || null);
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profile_connections")
        .upsert(
          {
            requester_id: currentProfileId,
            receiver_id: profileId,
            status: "accepted",
          },
          { onConflict: "requester_id,receiver_id" }
        );

      if (error) throw error;
      toast.success("Connection accepted!");
    } catch (error: any) {
      toast.error(error.message || "Error accepting connection");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profile_connections")
        .upsert(
          {
            requester_id: currentProfileId,
            receiver_id: profileId,
            status: "blocked",
          },
          { onConflict: "requester_id,receiver_id" }
        );

      if (error) throw error;
      toast.success("Profile blocked");
    } catch (error: any) {
      toast.error(error.message || "Error blocking profile");
    } finally {
      setLoading(false);
    }
  };

  if (connectionStatus === "blocked") {
    return (
      <div className="text-sm text-destructive font-medium">
        Blocked
      </div>
    );
  }

  if (connectionStatus === "accepted") {
    return (
      <div className="flex gap-2">
        <div className="text-sm text-green-600 font-medium flex items-center gap-1">
          <Check className="w-4 h-4" />
          Connected
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleBlock}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="default"
        size="sm"
        onClick={handleAccept}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Check className="w-4 h-4 mr-1" />
            Accept
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleBlock}
        disabled={loading}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default ConnectionActions;