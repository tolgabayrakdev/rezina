import Link from "next/link";
import { Car, Home } from "lucide-react";
import { BackButton } from "@/components/back-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız sayfa mevcut değil.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="BenGaraj Ana Sayfa"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-600">
              <Car className="size-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white">
              BenGaraj
            </span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-8 flex size-20 items-center justify-center rounded-2xl bg-brand-600/10 ring-1 ring-brand-600/20">
          <Car className="size-10 text-brand-500" strokeWidth={1.5} />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-500">
          404
        </p>
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Sayfa Bulunamadı
        </h1>
        <p className="mb-10 max-w-md text-base text-gray-400">
          Aradığınız sayfa mevcut değil ya da taşınmış olabilir. Ana sayfaya
          dönerek devam edebilirsiniz.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            <Home className="size-4" />
            Ana Sayfaya Dön
          </Link>
          <BackButton />
        </div>
      </main>

      <footer className="border-t border-white/5 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} BenGaraj. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
