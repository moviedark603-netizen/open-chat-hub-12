import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, User, Shield, Users, UsersRound, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileNavProps {
  isAdmin?: boolean;
  unreadCount?: number;
}

const MobileNav = ({ isAdmin, unreadCount }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: UsersRound, label: "Groups", path: "/groups" },
    { icon: BookOpen, label: "Blog", path: "/blog" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  if (isAdmin) {
    navItems.push({ icon: Shield, label: "Admin", path: "/admin" });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-strong z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-14 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 relative transition-colors touch-manipulation ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
