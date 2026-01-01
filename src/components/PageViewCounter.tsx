import { Eye, Users } from "lucide-react";

interface PageViewCounterProps {
  viewCount: number;
  onlineCount: number;
}

const PageViewCounter = ({ viewCount, onlineCount }: PageViewCounterProps) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
        <Eye className="w-4 h-4 text-primary" />
        <span className="font-medium text-foreground">{formatNumber(viewCount)}</span>
        <span className="text-muted-foreground text-xs">views</span>
      </div>
      <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1.5 rounded-full">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <Users className="w-4 h-4 text-green-600" />
        <span className="font-medium text-foreground">{onlineCount}</span>
        <span className="text-muted-foreground text-xs">online</span>
      </div>
    </div>
  );
};

export default PageViewCounter;
