import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Gift } from "lucide-react";

interface GiftTransaction {
  id: string;
  sender_id: string;
  receiver_id: string;
  points: number;
  message: string | null;
  created_at: string;
}

export const useGiftNotifications = (currentProfileId: string | null) => {
  useEffect(() => {
    if (!currentProfileId) return;

    // Subscribe to new gift transactions
    const channel = supabase
      .channel('gift-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gift_transactions',
          filter: `receiver_id=eq.${currentProfileId}`
        },
        async (payload) => {
          const newGift = payload.new as GiftTransaction;
          
          // Fetch sender profile
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', newGift.sender_id)
            .single();

          // Show notification
          toast.success(
            `${senderProfile?.name || 'Someone'} sent you ${newGift.points} gift points!`,
            {
              description: newGift.message || 'You received a gift!',
              duration: 5000,
              icon: <Gift className="h-5 w-5 text-primary" />,
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentProfileId]);
};
