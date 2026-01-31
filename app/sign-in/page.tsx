// app/login/page.tsx
import { auth, signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function LoginPage() {
  // Redirection si déjà connecté
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl max-w-md w-full border border-slate-100">
        <div className="p-8">
          {/* Logo ou Icône */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">
            StatAi
          </h2>
          <p className="text-center text-slate-500 mb-8">
            Connectez-vous à votre espace éducatif
          </p>

          <form
            action={async (formData) => {
              "use server";
              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/dashboard",
                });
              } catch (error) {
                if (isRedirectError(error)) throw error;

                if (error instanceof AuthError) {
                  return redirect(`/login?error=${error.type}`);
                }
                return redirect("/login?error=unknown");
              }
            }}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="nom@ecole.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mot de passe
              </label>
              <input
                name="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-blue-200"
            >
              Se connecter
            </button>
          </form>

          {/* <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Nouveau sur StatAi ?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/sign-up"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Créer un compte établissement
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
