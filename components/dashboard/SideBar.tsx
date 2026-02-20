"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  Calendar,
  ClipboardCheck
} from "lucide-react";

interface SidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    profileId: string | null;
  };
}

// Configuration des menus selon ton nouveau schéma Prisma
const menuByRole = {
  ADMIN: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Vue Globale" },
    { href: "/dashboard/admin/etablissements", icon: Users, label: "Établissements" },
    { href: "/dashboard/admin/system", icon: Settings, label: "Système" },
  ],
  ETABLISSEMENT: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/etablissement/classes", icon: Users, label: "Classes" },
    { href: "/dashboard/etablissement/matieres", icon: BookOpen, label: "Matières" },
    // { href: "/dashboard/etablissement/eleves", icon: GraduationCap, label: "Élèves" },
    { href: "/dashboard/etablissement/calendrier", icon: Calendar, label: "Années & Périodes" },
    { href: "/dashboard/etablissement/settings", icon: Settings, label: "Paramètres" },
  ],
  ETUDIANT: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Mon Profil" },
    { href: "/dashboard/etudiant/notes", icon: ClipboardCheck, label: "Mes Notes" },
    // { href: "/dashboard/etudiant/analyses", icon: BarChart3, label: "Analyses IA" },
    { href: "/dashboard/etudiant/chat", icon: MessageSquare, label: "Assistant StatAi" },
  ],
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const role = user.role as keyof typeof menuByRole;
  
  // On récupère le menu ou un tableau vide par défaut
  const menuItems = menuByRole[role] || [];

  const displayName = user.name || user.email?.split("@")[0] || "Utilisateur";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen shadow-sm">
      {/* Header / Logo StatAi */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <BarChart3 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">
              StatAi
            </span>
          </Link>
          <button className="p-1 hover:bg-slate-100 rounded-lg lg:hidden text-slate-500">
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-blue-600 text-white font-medium shadow-md shadow-blue-200"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section utilisateur */}
      <div className="p-4 border-t border-slate-100 mt-auto bg-slate-50/50">
        <div className="flex items-center gap-3 p-3 mb-3">
          <div className="flex-shrink-0">
            <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-bold border-2 border-white shadow-sm">
              {avatarInitial}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 text-sm truncate">{displayName}</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              {role}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="
            flex items-center gap-3 w-full px-4 py-2 text-sm font-medium text-red-500 
            hover:bg-red-50 rounded-lg transition-colors duration-200
          "
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}