import { auth } from "@/auth";
import Link from "next/link";
import React from "react";

async function NavBar() {
  const session = await auth();
  return (
    <div className="flex justify-between items-center bg-white px-32 py-8">
      {/* gauche */}
      <div>
        <h1 className="text-3xl font-semibold italic text-blue-600">StatAi</h1>
      </div>
      {/* <div>
        <Link href={"/etablissement"}>Etablissement</Link>
      </div> */}
      <div>
        {session ? (
          <div className="flex items-center gap-6">
            <span className="text-slate-700 font-medium">
              {session.user.name}
            </span>
            <Link href="/dashboard">
              <span className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                Get Start
              </span>
            </Link>
          </div>
        ) : (
          <Link href="/sign-in">
            <span className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Se connecter
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default NavBar;
