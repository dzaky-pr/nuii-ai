'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

export default function TanstackQueryProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
