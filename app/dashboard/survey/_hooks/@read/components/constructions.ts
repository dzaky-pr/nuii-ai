import api from '@/lib/tools/api'
import { IConstructionLite } from '@/lib/types/construction'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

export function useGetConstructions() {
  const { data, isPending } = useQuery<IConstructionLite[]>({
    queryKey: ['constructions', 'list'],
    queryFn: async () => {
      const response = await api.get('/konstruksi/list')
      return response.data.data
    },
    placeholderData: keepPreviousData
  })

  return {
    constructions: isPending
      ? []
      : data
      ? data.map(({ id, nama_konstruksi }) => ({
          value: id.toString(),
          label: nama_konstruksi
        }))
      : [],
    loadingConstructions: isPending
  }
}
