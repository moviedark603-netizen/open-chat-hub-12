import { cn } from "@/lib/utils";

interface OnlineStatusBadgeProps {
  isOnline: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const OnlineStatusBadge = ({ 
  isOnline, 
  size = "sm", 
  showLabel = false,
  className 
}: OnlineStatusBadgeProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          sizeClasses[size],
          isOnline 
            ? "bg-green-500 animate-pulse shadow-[0_0_6px_rgba(34,197,94,0.6)]" 
            : "bg-muted-foreground/40"
        )}
      />
      {showLabel && (
        <span className={cn(
          "text-xs",
          isOnline ? "text-green-500" : "text-muted-foreground"
        )}>
          {isOnline ? "Online" : "Offline"}
        </span>
      )}
    </div>
  );
};

export default OnlineStatusBadge;
