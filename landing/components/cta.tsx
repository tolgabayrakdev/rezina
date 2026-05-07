import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-gray-950 py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,oklch(0.513_0.2013_274.7847/0.2),transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl">
          Galerinizi Dijitale Taşımaya{" "}
          <span className="text-brand-400">Hazır mısınız?</span>
        </h2>
        <p className="mb-10 text-lg leading-relaxed text-gray-400">
          Ücretsiz hesabınızı şimdi oluşturun ve BenGaraj&apos;ın tüm
          özelliklerinden hemen yararlanmaya başlayın.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Ücretsiz Hesap Oluştur
          <ArrowRight className="size-5" />
        </Link>

        <p className="mt-4 text-sm text-gray-600">
          Kredi kartı gerekmez · Kurulum yok · Hemen başla
        </p>
      </div>
    </section>
  );
}
