import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) redirect("/sign-in");

  switch (session.user.role) {
    case "ADMIN":
      redirect("/dashboard/admin");
    case "ETABLISSEMENT":
      redirect("/dashboard/etablissement");
    case "ETUDIANT":
      redirect("/dashboard/etudiant");
    default:
      redirect("/sign-in");
  }
}
