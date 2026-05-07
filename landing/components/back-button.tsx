"use client";

import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:border-white/20 hover:text-white"
    >
      <ArrowLeft className="size-4" />
      Geri Git
    </button>
  );
}
