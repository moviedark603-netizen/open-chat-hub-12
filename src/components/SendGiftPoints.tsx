import { useState } from "react";
import { Gift, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SendGiftPointsProps {
  currentProfileId: string;
  receiverProfileId: string;
  receiverName: string;
  onSuccess?: () => void;
}

const SendGiftPoints = ({
  currentProfileId,
  receiverProfileId,
  receiverName,
  onSuccess,
}: SendGiftPointsProps) => {
  const [open, setOpen] = useState(false);
  const [points, setPoints] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const pointsNum = parseInt(points);
    
    if (!pointsNum || pointsNum <= 0) {
      toast.error("Please enter a valid number of points");
      return;
    }

    if (pointsNum > 1000) {
      toast.error("Maximum 1000 points per transaction");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.rpc("transfer_gift_points", {
        p_sender_id: currentProfileId,
        p_receiver_id: receiverProfileId,
        p_points: pointsNum,
        p_message: message || null,
      });

      if (error) throw error;

      toast.success(`Sent ${pointsNum} gift points to ${receiverName}!`);
      setOpen(false);
      setPoints("");
      setMessage("");
      onSuccess?.();
    } catch (error: any) {
      if (error.message?.includes("Insufficient")) {
        toast.error("You don't have enough gift points");
      } else {
        toast.error("Failed to send gift points");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Gift className="h-4 w-4" />
          Send Gift
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Send Gift Points
          </DialogTitle>
          <DialogDescription>
            Send gift points to {receiverName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Points to send</label>
            <Input
              type="number"
              placeholder="Enter points (1-1000)"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              min="1"
              max="1000"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Message (optional)</label>
            <Textarea
              placeholder="Add a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sending || !points}
            className="w-full gap-2"
          >
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : "Send Gift Points"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendGiftPoints;
