import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MessageNotification {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export const useMessageNotifications = (currentProfileId: string | null) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentProfileId) return;

    // Subscribe to new messages
    const channel = supabase
      .channel('message-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentProfileId}`
        },
        async (payload) => {
          const newMessage = payload.new as MessageNotification;
          
          // Fetch sender profile
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', newMessage.sender_id)
            .single();

          // Show notification
          toast.success(`New message from ${senderProfile?.name || 'Someone'}`, {
            description: newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''),
            duration: 5000,
          });

          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProfileId]);

  const resetUnreadCount = () => setUnreadCount(0);

  return { unreadCount, resetUnreadCount };
};
