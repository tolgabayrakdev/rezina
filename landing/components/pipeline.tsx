import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

const stages = [
  {
    step: "01",
    label: "İlgili",
    description: "Müşteri araçla ilgileniyor, kayıt oluşturuldu.",
    cardCls: "border-violet-200 bg-violet-50 text-violet-700",
    dotCls: "bg-violet-500",
    numCls: "text-violet-400",
  },
  {
    step: "02",
    label: "Test Sürüşü",
    description: "Müşteri aracı test etmek için randevu aldı.",
    cardCls: "border-sky-200 bg-sky-50 text-sky-700",
    dotCls: "bg-sky-500",
    numCls: "text-sky-400",
  },
  {
    step: "03",
    label: "Pazarlık",
    description: "Fiyat ve koşullar üzerine görüşme sürüyor.",
    cardCls: "border-orange-200 bg-orange-50 text-orange-700",
    dotCls: "bg-orange-500",
    numCls: "text-orange-400",
  },
  {
    step: "04",
    label: "Satıldı",
    description: "Satış tamamlandı, araç teslim edildi.",
    cardCls: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotCls: "bg-emerald-500",
    numCls: "text-emerald-400",
  },
];

export function Pipeline() {
  return (
    <section className="bg-gray-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            Satış Sürecinizi Adım Adım Takip Edin
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-500">
            Hangi müşteri hangi aşamada? Anlık görün, hiçbir fırsatı
            kaçırmayın.
          </p>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
          {stages.map(({ step, label, description, cardCls, dotCls, numCls }, index) => (
            <Fragment key={label}>
              <article
                className={`flex flex-1 flex-col rounded-2xl border p-6 ${cardCls}`}
              >
                <span className={`mb-3 text-3xl font-black opacity-30 ${numCls}`}>
                  {step}
                </span>
                <div className="mb-2 flex items-center gap-2">
                  <span className={`size-2 shrink-0 rounded-full ${dotCls}`} />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-70">
                  {description}
                </p>
              </article>
              {index < stages.length - 1 && (
                <div className="hidden shrink-0 items-center justify-center sm:flex">
                  <ArrowRight className="size-5 text-gray-300" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-gray-400">
          Ayrıca <span className="font-medium text-red-500">Kayıp</span> durumu
          ile kaçan fırsatları da takip edebilirsiniz.
        </p>
      </div>
    </section>
  );
}
