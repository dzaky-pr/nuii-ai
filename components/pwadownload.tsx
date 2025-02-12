'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { FiInfo } from 'react-icons/fi'
import { toast } from 'sonner'

import { twMerge as clsxm } from 'tailwind-merge'
import { Button } from './ui/button'

export default function PwaDownloadAnnouncement() {
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false)
  const [prompt, setPrompt] = useState<
    | (Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> })
    | null
  >(null)
  const pathname = usePathname()
  const validatePathname = pathname === '/'
  // pathname === '/try-out' ||
  // pathname === '/webinar' ||
  // pathname === '/info-pai' ||
  // pathname === '/auth/masuk' ||
  // pathname === '/auth/daftar' ||
  // pathname === '/auth/daftar/data-diri'

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault()
      setPrompt(event)

      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallModal(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      )
    }
  }, [])

  const handleInstallClick = () => {
    if (prompt) {
      prompt.prompt()
      prompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          toast.success('Aplikasi berhasil terinstall! 🎉')
        } else {
          toast.warning('Aplikasi gagal terinstall!')
        }

        setPrompt(null)
        setShowInstallModal(false)
      })
    }
  }

  const handleCloseModal = () => {
    setShowInstallModal(false)
  }

  return (
    // validatePathname &&
    showInstallModal && (
      <div
        className={clsxm(
          'flex justify-between dark:bg-yellow-600 bg-yellow-300  px-5 py-3 shadow-xl'
        )}
      >
        <div></div>
        <div className="flex flex-col gap-x-2 gap-y-2.5 md:flex-row">
          <p className="inline-flex items-center gap-x-2 text-sm font-semibold sm:text-base">
            <FiInfo className="h-5 w-5" />
            Unduh aplikasi NUII AI sekarang!
          </p>
          <Button
            onClick={handleInstallClick}
            variant="secondary"
            className="flex w-fit"
          >
            Download app
          </Button>
        </div>

        <Button size="icon" onClick={handleCloseModal} variant="ghost">
          <FaXmark className="h-5 w-5" />
        </Button>
      </div>
    )
  )
}
