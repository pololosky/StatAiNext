// app/dashboard/layout.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/SideBar";
import TopBar from "@/components/dashboard/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protection de route : redirection si non connecté
  if (!session?.user) {
    redirect("/login");
  }

  // Préparation de l'objet utilisateur pour les composants enfants (SideBar/TopBar)
  // On remplace tenantId par profileId conformément à ton nouveau schéma
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    profileId: session.user.profileId, // Ton ID Etablissement ou Etudiant
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar - On passe l'utilisateur avec son rôle pour gérer les menus */}
      <Sidebar user={user} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar - Barre de navigation supérieure */}
        <TopBar user={user} />

        {/* Page Content - Zone de défilement du contenu principal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
