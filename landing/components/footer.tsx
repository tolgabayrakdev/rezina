import Link from "next/link";
import { Car } from "lucide-react";

const links = [
  { label: "Özellikler", href: "#ozellikler" },
  { label: "Nasıl Çalışır", href: "#nasil-calisir" },
  { label: "SSS", href: "#sss" },
  { label: "Giriş Yap", href: "/login" },
  { label: "Kayıt Ol", href: "/register" },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2.5"
              aria-label="BenGaraj Ana Sayfa"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-brand-600">
                <Car className="size-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-white">
                BenGaraj
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              İkinci el araç galerileri için akıllı yönetim sistemi. Araç
              envanterinizi, müşterilerinizi ve satışlarınızı tek platformdan
              yönetin.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Alt navigasyon">
            <p className="mb-3 text-xs font-semibold tracking-widest text-gray-600 uppercase">
              Bağlantılar
            </p>
            <ul className="space-y-2.5">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 transition-colors hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-8 sm:flex-row">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} BenGaraj. Tüm hakları saklıdır.
          </p>
          <p className="text-xs text-gray-700">
            Araç Galerisi Yönetim Sistemi &middot; Türkiye
          </p>
        </div>
      </div>
    </footer>
  );
}
