import { useNavigate, useLocation } from "react-router-dom";
import { Home, MessageSquare, User, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MobileNavProps {
  isAdmin?: boolean;
  unreadCount?: number;
}

const MobileNav = ({ isAdmin, unreadCount }: MobileNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Discover", path: "/" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  if (isAdmin) {
    navItems.push({ icon: Shield, label: "Admin", path: "/admin" });
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-strong z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 relative transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
