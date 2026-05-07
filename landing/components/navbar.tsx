import Link from "next/link";
import { Car } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-gray-950">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
        aria-label="Ana navigasyon"
      >
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

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#ozellikler"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Özellikler
          </Link>
          <Link
            href="#nasil-calisir"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            Nasıl Çalışır
          </Link>
          <Link
            href="#sss"
            className="text-sm text-gray-400 transition-colors hover:text-white"
          >
            SSS
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-gray-400 transition-colors hover:text-white sm:block"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Ücretsiz Başla
          </Link>
        </div>
      </nav>
    </header>
  );
}
