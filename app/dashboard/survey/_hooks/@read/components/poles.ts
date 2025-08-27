import api from '@/lib/tools/api'
import { IPoleLite } from '@/lib/types/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useGetPoles() {
  const { data, isPending } = useQuery<IPoleLite[]>({
    queryKey: ['poles', 'list'],
    queryFn: async () => {
      const response = await api.get('/pole/list')
      return response.data.data
    },
    placeholderData: keepPreviousData
  })

  return {
    poles: isPending
      ? []
      : data
      ? data.map(({ id, nama_pole_supporter }) => ({
          value: id.toString(),
          label: nama_pole_supporter
        }))
      : [],
    loadingPoles: isPending
  }
}
