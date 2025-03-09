import api from '@/lib/tools/api'
import { IMaterialWithLog } from '@/lib/types/material'
import { useQuery } from '@tanstack/react-query'

const useGetLog = () => {
  const { data, isPending } = useQuery<IMaterialWithLog[]>({
    queryKey: ['logHistory'],
    queryFn: async () => {
      const response = await api.get('/log')
      return response.data.data
    }
  })
  return {
    listAll: isPending ? [] : data,
    loadingListAll: isPending
  }
}

export { useGetLog }
