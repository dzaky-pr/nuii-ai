import api from '@/lib/tools/api'
import { IMaterialWithTimestamps } from '@/lib/types/material'

import { useQuery } from '@tanstack/react-query'

const useGetAllList = () => {
  const { data, isPending } = useQuery<IMaterialWithTimestamps[]>({
    queryKey: ['allList'],
    queryFn: async () => {
      const response = await api.get('/material/list')
      return response.data.data
    }
  })
  return {
    listAll: isPending ? [] : data,
    loadingListAll: isPending
  }
}

export { useGetAllList }
