import { Car, Users, Handshake, ImageIcon, Link2 } from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Araç Envanteri",
    description:
      "Tüm araçlarınızı marka, model, yıl, kilometre ve fiyat bilgileriyle kaydedin. Stok durumunu anlık olarak takip edin.",
  },
  {
    icon: Users,
    title: "Müşteri Yönetimi",
    description:
      "Potansiyel müşterilerinizi kayıt altına alın, iletişim bilgilerini saklayın, notlar ekleyerek süreci yönetin.",
  },
  {
    icon: Handshake,
    title: "Satış Pipeline'ı",
    description:
      "İlgi'den satışa giden her aşamayı takip edin. Hangi müşterinin hangi araçla ilgilendiğini anında görün.",
  },
  {
    icon: ImageIcon,
    title: "Fotoğraf Galerisi",
    description:
      "Her araç için fotoğraf ekleyin, kapak fotoğrafı belirleyin. Araç görsellerini kolayca organize edin.",
  },
  {
    icon: Link2,
    title: "İlan Entegrasyonu",
    description:
      "Sahibinden.com, arabam.com ve diğer platformlardaki ilan bağlantılarını araçlara ekleyerek takibi kolaylaştırın.",
  },
];

export function Features() {
  return (
    <section id="ozellikler" className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            İhtiyacınız Olan Her Şey,{" "}
            <span className="text-brand-600">Tek Yerden</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500">
            BenGaraj, ikinci el araç galerileri için özel tasarlanmış kapsamlı
            bir yönetim platformudur. Karmaşık yazılımlar yerine sade ve
            güçlü bir çözüm.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-2xl border border-gray-100 bg-gray-50/50 p-6 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
            >
              <div className="mb-4 inline-flex rounded-xl bg-brand-600/10 p-3">
                <Icon className="size-5 text-brand-600" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
