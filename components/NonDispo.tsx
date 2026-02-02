"use client";

import { useRouter } from "next/navigation";
import {
  Construction,
  ArrowLeft,
  Timer,
  Sparkles,
  BellRing,
} from "lucide-react";
import Card from "@/components/Card";

export default function FeatureNotAvailable() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Illustration Iconographique */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse" />
          <div className="relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
            <Construction size={64} className="text-blue-600 animate-bounce" />
          </div>
          <Sparkles
            className="absolute -top-2 -right-2 text-amber-400 animate-spin-slow"
            size={32}
          />
        </div>

        {/* Texte Principal */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            C'est pour bientôt !
          </h1>
          <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
            Nos développeurs travaillent d'arrache-pied pour finaliser cette
            fonctionnalité. Elle sera disponible lors de la prochaine mise à
            jour.
          </p>
        </div>

        {/* Stats de Progression (Factice pour le design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
          <Card className="flex items-center gap-4 py-4 px-6 border-none bg-slate-50">
            <Timer className="text-blue-500" size={24} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Statut
              </p>
              <p className="text-sm font-bold text-slate-700">
                En cours de test
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 py-4 px-6 border-none bg-slate-50">
            <BellRing className="text-amber-500" size={24} />
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Version
              </p>
              <p className="text-sm font-bold text-slate-700">v1.0-beta</p>
            </div>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            Retourner au tableau de bord
          </button>

          <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
            Être notifié par email
          </button>
        </div>

        <p className="text-xs text-slate-400 pt-8 uppercase tracking-[0.2em] font-medium">
          L'IA Scolaire avance avec vous
        </p>
      </div>
    </div>
  );
}
