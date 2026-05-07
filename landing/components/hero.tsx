import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { MockDashboard } from "./mock-dashboard";

const highlights = [
  "Tamamen ücretsiz",
  "Kurulum gerektirmez",
  "Hemen başla",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gray-950 pb-24 pt-20">
      {/* Radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,oklch(0.513_0.2013_274.7847/0.25),transparent_65%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-600/30 bg-brand-600/10 px-4 py-1.5">
              <span className="size-1.5 shrink-0 rounded-full bg-brand-400" />
              <span className="text-sm font-medium text-brand-300">
                İkinci El Araç Galerileri İçin
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-6xl">
              Galerinizi{" "}
              <span className="text-brand-400">Dijitale</span>{" "}
              Taşıyın
            </h1>

            <p className="mb-8 text-lg leading-relaxed text-gray-400">
              Araç envanterinizi, müşterilerinizi ve satış sürecinizi tek
              platformdan yönetin. BenGaraj ile galeriniz artık her zaman
              elinizin altında.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-700"
              >
                Ücretsiz Başla
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="#ozellikler"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/5"
              >
                Özellikleri İncele
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-5">
              {highlights.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-brand-400" />
                  <span className="text-sm text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right – mock UI */}
          <div className="relative hidden lg:block">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-brand-600/10 blur-3xl" />
            <MockDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
