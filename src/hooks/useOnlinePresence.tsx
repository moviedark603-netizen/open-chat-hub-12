import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";

interface OnlineUser {
  id: string;
  name: string;
  online_at: string;
  presence_ref?: string;
}

export const useOnlinePresence = (profileId: string | null, profileName: string | null) => {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, OnlineUser[]>>({});
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!profileId || !profileName) return;

    const presenceChannel = supabase.channel('online-users', {
      config: {
        presence: {
          key: profileId,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState() as unknown as Record<string, OnlineUser[]>;
        setOnlineUsers(newState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            id: profileId,
            name: profileName,
            online_at: new Date().toISOString(),
          });
        }
      });

    setChannel(presenceChannel);

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [profileId, profileName]);

  const isUserOnline = (userId: string): boolean => {
    return Object.keys(onlineUsers).includes(userId);
  };

  const getOnlineUserIds = (): string[] => {
    return Object.keys(onlineUsers);
  };

  const onlineCount = Object.keys(onlineUsers).length;

  return { onlineUsers, isUserOnline, getOnlineUserIds, onlineCount };
};
