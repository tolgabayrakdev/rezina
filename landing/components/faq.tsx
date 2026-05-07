import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "BenGaraj tamamen ücretsiz mi?",
    answer:
      "Evet, BenGaraj tamamen ücretsizdir. Herhangi bir ücret, aylık abonelik veya kredi kartı bilgisi gerekmez. Tüm özellikler sınırsız ve ücretsiz kullanılabilir.",
  },
  {
    question: "Kaç araç ekleyebilirim?",
    answer:
      "Araç sayısında herhangi bir sınır bulunmamaktadır. Envanterinize istediğiniz kadar araç ekleyebilir ve yönetebilirsiniz.",
  },
  {
    question: "Verilerim güvende mi?",
    answer:
      "Verileriniz güvenli sunucularda saklanmakta ve şifrelenmektedir. Kişisel bilgileriniz hiçbir koşulda üçüncü taraflarla paylaşılmaz.",
  },
  {
    question: "Mobil cihazlardan kullanabilir miyim?",
    answer:
      "Evet. BenGaraj responsive tasarımıyla masaüstü, tablet ve akıllı telefon gibi tüm cihazlarda sorunsuz şekilde çalışır. Ek bir uygulama indirmenize gerek yoktur.",
  },
  {
    question: "Sahibinden.com veya arabam.com ile entegrasyon var mı?",
    answer:
      "Doğrudan platform entegrasyonu yerine, araçlarınıza sahibinden.com, arabam.com veya diğer ilan sitelerindeki bağlantıları ekleyerek hızlıca erişebilirsiniz.",
  },
];

export function FAQ() {
  return (
    <section id="sss" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            Sık Sorulan Sorular
          </h2>
          <p className="text-lg text-gray-500">
            Aklınızdaki soruların cevabını bulamadıysanız bize ulaşın.
          </p>
        </header>

        <dl className="space-y-2">
          {faqs.map(({ question, answer }) => (
            <details
              key={question}
              className="group rounded-2xl border border-gray-200 bg-white px-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <dt className="text-base font-semibold text-gray-900">
                  {question}
                </dt>
                <ChevronDown className="size-5 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <dd className="pb-5 text-sm leading-relaxed text-gray-500">
                {answer}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
