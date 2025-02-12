import React from 'react'

const Footer: React.FC = () => {
  return (
    // <footer className="w-fit p-1 md:p-2 fixed bottom-0 right-0">
    <footer className="w-full p-2 fixed bottom-0 left-0 right-0 bg-background px-4">
      {/* <div className="flex justify-end">
        <Button
          variant={'ghost'}
          size={'icon'}
          className="text-muted-foreground/50"
        >
          <Link href="https://discord.gg/" target="_blank">
            <SiDiscord size={18} />
          </Link>
        </Button>
        <Button
          variant={'ghost'}
          size={'icon'}
          className="text-muted-foreground/50"
        >
          <Link href="https://x.com/" target="_blank">
            <SiX size={18} />
          </Link>
        </Button>
        <Button
          variant={'ghost'}
          size={'icon'}
          className="text-muted-foreground/50"
        >
          <Link href="https://git.new/" target="_blank">
            <SiGithub size={18} />
          </Link>
        </Button>
      </div> */}
      <div className="flex items-center justify-center">
        <p className="text-[10px] text-muted-foreground text-center">
          NUII AI Chatbot v.1.0.0 dapat membuat kesalahan. Periksa informasi
          penting dengan cermat.
        </p>
      </div>
    </footer>
  )
}

export default Footer
