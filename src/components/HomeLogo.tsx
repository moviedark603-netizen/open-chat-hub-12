import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.jpg";

interface HomeLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const HomeLogo = ({ size = "md", showText = true }: HomeLogoProps) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  return (
    <button
      onClick={() => navigate("/")}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity touch-manipulation"
      aria-label="Go to home"
    >
      <img
        src={logo}
        alt="OTHERS"
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-primary/20`}
      />
      {showText && (
        <span className="font-bold text-lg text-foreground tracking-tight">OTHERS</span>
      )}
    </button>
  );
};

export default HomeLogo;
