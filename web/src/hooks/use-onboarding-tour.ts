import { useEffect, useRef, useState } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"
import { useAuthStore } from "@/store/auth-store"

export function useOnboardingTour() {
  const user = useAuthStore((s) => s.user)
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)
  const startedRef = useRef(false)
  const [showCelebration, setShowCelebration] = useState(false)

  useEffect(() => {
    if (!user || user.onboardingCompleted || startedRef.current) return
    startedRef.current = true

    const timer = setTimeout(() => {
      const driverObj = driver({
        showProgress: true,
        progressText: "{{current}} / {{total}}",
        nextBtnText: "İleri →",
        prevBtnText: "← Geri",
        doneBtnText: "✓ Tamamla",
        allowClose: false,
        overlayOpacity: 0.55,
        stagePadding: 10,
        stageRadius: 10,
        popoverClass: "bg-tour",
        steps: [
          {
            popover: {
              title: "🎉 BenGaraj'a Hoş Geldiniz!",
              description:
                "Araç galerinizi yönetmek için tasarlanmış platforma hoş geldiniz. Size kısa bir tur eşliğinde temel özellikleri gösterelim.",
              align: "center",
            },
          },
          {
            element: "#tour-stats",
            popover: {
              title: "📊 Anlık İstatistikler",
              description:
                "Stoktaki araç sayısı, aktif müşteri ilgileri, satışlar ve toplam geliri buradan anlık olarak takip edebilirsiniz.",
              side: "bottom",
              align: "start",
            },
          },
          {
            element: "#tour-nav-cars",
            popover: {
              title: "🚗 Araçlar",
              description:
                "Galerinizdeki tüm araçları buradan yönetebilirsiniz. Araç ekleme, fotoğraf, ekspertiz, sigorta ve servis geçmişi için buraya tıklayın.",
              side: "right",
              align: "center",
            },
          },
          {
            element: "#tour-nav-customers",
            popover: {
              title: "👥 Müşteriler",
              description:
                "Müşteri bilgilerini (ad, soyad, telefon, e-posta) kaydedin ve düzenleyin. Müşterileri ileride araçlarla ilişkilendirebilirsiniz.",
              side: "right",
              align: "center",
            },
          },
          {
            element: "#tour-nav-interests",
            popover: {
              title: "🤝 Müşteri İlgileri",
              description:
                "Hangi müşterinin hangi araçla ilgilendiğini buradan takip edin. İlgili → Test Sürüşü → Pazarlık → Satıldı aşamalarıyla satış sürecinizi yönetin.",
              side: "right",
              align: "center",
            },
          },
          {
            element: "#tour-recent-cars",
            popover: {
              title: "🕐 Son Eklenen Araçlar",
              description:
                "Ana sayfada en son eklenen araçlarınızı görebilirsiniz. Detaya gitmek için araç adına tıklayın.",
              side: "top",
              align: "start",
            },
          },
          {
            popover: {
              title: "✅ Her Şey Hazır!",
              description:
                "Artık BenGaraj'ı kullanmaya başlayabilirsiniz. Sol menüden istediğiniz bölüme geçin. Başarılar! 🚀",
              align: "center",
              // Sadece bu butona basılınca onboarding tamamlanır
              onNextClick: () => {
                completeOnboarding()
                setShowCelebration(true)
                driverObj.destroy()
              },
            },
          },
        ],
      })

      driverObj.drive()
    }, 700)

    return () => {
      clearTimeout(timer)
      startedRef.current = false
    }
  }, [user])

  return {
    showCelebration,
    onCelebrationDone: () => setShowCelebration(false),
  }
}
