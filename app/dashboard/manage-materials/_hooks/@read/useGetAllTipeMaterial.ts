import api from '@/lib/tools/api'
import { ITipeMaterial } from '@/lib/types/material'

import { useQuery } from '@tanstack/react-query'

const useGetAllTipeMaterial = () => {
  const { data, isPending } = useQuery<ITipeMaterial[]>({
    queryKey: ['allTipeMaterial'],
    queryFn: async () => {
      const response = await api.get('/material/list/tipe')
      return response.data.data
    }
  })
  return {
    listTipeMaterial: isPending ? [] : data,
    loadingListTipeMaterial: isPending
  }
}

export { useGetAllTipeMaterial }
