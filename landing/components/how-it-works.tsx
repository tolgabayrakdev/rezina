import { UserPlus, Building2, Car, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "1",
    icon: UserPlus,
    title: "Hesabınızı Oluşturun",
    description:
      "E-posta adresinizle saniyeler içinde ücretsiz hesabınızı oluşturun. Kredi kartı veya abonelik gerekmez.",
  },
  {
    number: "2",
    icon: Building2,
    title: "Galerinizi Ekleyin",
    description:
      "Bir veya birden fazla galeri workspace'i oluşturun. Her galeri için ayrı envanter ve müşteri listesi tutun.",
  },
  {
    number: "3",
    icon: Car,
    title: "Araçlarınızı Kaydedin",
    description:
      "Araç bilgilerini girin, fotoğraf ekleyin, ilan linklerini bağlayın. Tüm stokunu tek ekranda görün.",
  },
  {
    number: "4",
    icon: TrendingUp,
    title: "Süreci Takip Edin",
    description:
      "Müşterileri ekleyin, araçlara ilgi kaydı oluşturun ve satış aşamalarını adım adım izleyin.",
  },
];

export function HowItWorks() {
  return (
    <section id="nasil-calisir" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            3 Dakikada Başlayın
          </h2>
          <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-500">
            Kurulum yok, teknik bilgi gerekmez. Hesabınızı oluşturun ve
            galerinizi anında yönetmeye başlayın.
          </p>
        </header>

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, description }) => (
            <li key={number} className="relative flex flex-col">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-600/10 ring-1 ring-brand-600/20">
                  <Icon className="size-5 text-brand-600" />
                </div>
                <span className="text-4xl font-black text-gray-100">
                  {number}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
