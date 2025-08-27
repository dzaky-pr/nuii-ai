import api from '@/lib/tools/api'
import { IMaterial } from '@/lib/types/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useGetConductors() {
  const { data, isPending } = useQuery<IMaterial[]>({
    queryKey: ['conductors', 'list'],
    queryFn: async () => {
      const response = await api.get('/material/list/konduktor')
      return response.data.data
    },
    placeholderData: keepPreviousData
  })

  return {
    conductors: isPending
      ? []
      : data
      ? data.map(({ id, nama_material }) => ({
          value: id.toString(),
          label: nama_material
        }))
      : [],
    loadingConductors: isPending
  }
}
