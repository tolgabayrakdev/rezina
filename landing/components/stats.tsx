import { Gift, Zap, Package, Shield } from "lucide-react";

const stats = [
  {
    icon: Gift,
    value: "0 ₺",
    label: "Maliyet",
    description: "Tamamen ücretsiz kullanın",
  },
  {
    icon: Zap,
    value: "Anlık",
    label: "Takip",
    description: "Veriler gerçek zamanlı güncellenir",
  },
  {
    icon: Package,
    value: "Sınırsız",
    label: "Araç",
    description: "Stok limitiniz bulunmaz",
  },
  {
    icon: Shield,
    value: "Güvenli",
    label: "Veri",
    description: "Bilgileriniz şifreli saklanır",
  },
];

export function Stats() {
  return (
    <section className="border-y border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map(({ icon: Icon, value, label, description }) => (
            <div key={label} className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10">
                <Icon className="size-5 text-brand-600" />
              </div>
              <div>
                <dt className="text-2xl font-bold tracking-tight text-gray-900">
                  {value}{" "}
                  <span className="text-brand-600">{label}</span>
                </dt>
                <dd className="mt-0.5 text-sm text-gray-500">{description}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
