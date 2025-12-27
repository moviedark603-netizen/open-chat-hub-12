import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

const DownloadBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground py-3 px-4">
      <div className="container mx-auto flex items-center justify-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 animate-fade-in">
          <Smartphone className="h-5 w-5 animate-bounce-soft" />
          <span className="text-sm font-medium">
            Get our app for a better experience!
          </span>
        </div>
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="gap-2 hover:scale-105 transition-transform"
        >
          <a href="/downloads/OTHERS.apk" download="OTHERS.apk">
            <Download className="h-4 w-4" />
            Download App
          </a>
        </Button>
      </div>
    </div>
  );
};

export default DownloadBanner;
