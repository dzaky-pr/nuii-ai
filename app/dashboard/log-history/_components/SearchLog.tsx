'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const SearchLog = () => {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="mb-6 gap-4 flex-col md:flex-row flex w-full justify-between items-center">
      <form
        onSubmit={e => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const queryTerm = formData.get('search') as string
          router.push(pathname + '?search=' + queryTerm)
        }}
        className="flex flex-col gap-2"
      >
        <label htmlFor="search" className="text-sm lg:text-lg font-medium">
          Search for logs:
        </label>
        <div className="flex flex-col md:flex-row w-full gap-2">
          <Input
            id="search"
            name="search"
            type="text"
            placeholder="Enter material name"
            className="px-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Search
          </Button>
        </div>
      </form>
    </div>
  )
}
