import { Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GiftPointsBadgeProps {
  points: number;
  className?: string;
}

const GiftPointsBadge = ({ points, className }: GiftPointsBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={`gap-1.5 px-3 py-1 text-sm font-medium ${className}`}
    >
      <Gift className="h-4 w-4 text-primary" />
      {points} Points
    </Badge>
  );
};

export default GiftPointsBadge;
