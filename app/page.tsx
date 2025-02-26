import PwaDownloadAnnouncement from '@/components/pwadownload'
import { ShinyButton } from '@/components/ui/shiny-button'
import Image from 'next/image'
import Link from 'next/link'
import './globals.css'

export default function Page() {
  return (
    <>
      <PwaDownloadAnnouncement />
      <div className="flex flex-col h-screen bg-background mx-auto container ">
        {/* Hero Section */}
        <header className="flex flex-col items-center justify-center bg-gradient-to-r bg-background h-[70vh] text-center py-12">
          <Image
            src="/logo/nuii-logo-v2-black.png"
            className="w-[200px] h-auto dark:hidden pb-4"
            alt="Nuii Logo"
            width={200}
            height={200}
            priority
          />

          <Image
            src="/logo/nuii-logo-v2-white.png"
            className="w-[200px] h-auto hidden dark:block pb-4"
            alt="Nuii Logo"
            width={200}
            height={200}
            priority
          />

          <p className="text-xl mb-6 max-w-3xl">
            Standar Konstruksi by Artificial Intelligence (NUII) Solusi AI
            cerdas untuk perencanaan dan pengawasan konstruksi jaringan listrik
            PLN, dengan data standar, material, gambar, dan RAB dalam genggaman.
          </p>
          <Link href="/dashboard/chat">
            <ShinyButton className="px-6 py-3 rounded-lg shadow-md ">
              Start Chatting
            </ShinyButton>
          </Link>
        </header>

        {/* Detail Section */}
        <section className="flex flex-col items-center py-16 bg-background">
          <h2 className="text-3xl font-semibold mb-8">Cara Kerja</h2>
          <p className="text-lg max-w-2xl text-center mb-6">
            NUII memanfaatkan teknologi AI untuk mempermudah perencanaan dan
            pengawasan konstruksi jaringan listrik PLN. Dengan data standar,
            material, gambar, dan RAB yang terintegrasi, NUII memberikan solusi
            cerdas untuk setiap tahap proyek.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-200  rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="font-semibold">Cerdas & Terintegrasi</h3>
              <p className="text-center text-sm">
                Menyediakan data konstruksi dan material yang lengkap dalam satu
                platform
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-200  rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold">Cepat & Akurat</h3>
              <p className="text-center text-sm">
                Menyediakan informasi dan perencanaan real-time tanpa hambatan
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 bg-background text-center text-xs">
          <p>&copy; {new Date().getFullYear()} NUII AI. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
