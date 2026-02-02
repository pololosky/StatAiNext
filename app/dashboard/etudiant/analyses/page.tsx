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
import FeatureNotAvailable from "@/components/NonDispo";

export default function page() {
  const router = useRouter();

  return (
    <>
      <FeatureNotAvailable />
    </>
  );
}
