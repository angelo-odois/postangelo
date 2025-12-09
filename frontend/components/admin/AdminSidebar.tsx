"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FolderKanban,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ThemeToggleSimple } from "@/components/theme-toggle";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    label: "",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Curriculo",
    items: [
      {
        title: "Perfil",
        href: "/admin/profile",
        icon: User,
      },
      {
        title: "Experiencias",
        href: "/admin/experiences",
        icon: Briefcase,
      },
      {
        title: "Formacao",
        href: "/admin/education",
        icon: GraduationCap,
      },
      {
        title: "Skills",
        href: "/admin/skills",
        icon: Lightbulb,
      },
    ],
  },
  {
    label: "Portfolio",
    items: [
      {
        title: "Projetos",
        href: "/admin/pages",
        icon: FolderKanban,
      },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    router.push("/admin");
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image
            src="/revuuLogo.png"
            alt="Revuu"
            width={120}
            height={40}
            className="dark:invert"
          />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggleSimple />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="lg:hidden h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.label && (
              <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                {section.label}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-amber-500/10 text-amber-600 shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      !isActive && "group-hover:scale-110"
                    )} />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t p-4">
        {user && (
          <>
            <Link
              href={`/u/${user.username || 'admin'}`}
              target="_blank"
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 mb-2 hover:translate-x-1"
            >
              <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              Ver Curriculo Publico
            </Link>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 font-semibold shrink-0">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 shrink-0"
              >
                <LogOut className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden h-10 w-10 bg-card border shadow-sm"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r bg-card flex flex-col lg:hidden transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
