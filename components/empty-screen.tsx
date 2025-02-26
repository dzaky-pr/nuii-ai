import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Siapakah Anda?',
    message: 'Siapakah Anda?'
  },
  {
    heading: 'Bagaimana NUII Mendapatkan Informasi?',
    message: 'Bagaimana NUII Mendapatkan Informasi?'
  },
  {
    heading: 'Apa itu "Konstruksi Tiang TM-5C"?',
    message: 'Apa itu "Konstruksi Tiang TM-5C"?'
  },
  {
    heading: 'Jelaskan Terminal Lug CuAl!',
    message: 'Jelaskan Terminal Lug CuAl!'
  }
]
export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto w-full transition-all ${className}`}>
      <div className="bg-background p-2">
        <div className="mt-2 flex flex-col items-start space-y-2 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              name={message.message}
              onClick={async () => {
                submitMessage(message.message)
              }}
            >
              <ArrowRight size={16} className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
