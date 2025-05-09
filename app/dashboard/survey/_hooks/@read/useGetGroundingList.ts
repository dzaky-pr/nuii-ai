import api from '@/lib/tools/api'
import { IGroundingLite } from '@/lib/types/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const useGetGroundingList = () => {
  const { data, isPending } = useQuery<IGroundingLite[]>({
    queryKey: ['groundingList'],
    queryFn: async () => {
      const response = await api.get('/grounding/list')
      return response.data.data
    },
    placeholderData: keepPreviousData
  })

  return {
    groundingList: isPending
      ? []
      : data
      ? data.map(({ id, nama_grounding_termination }) => ({
          value: id.toString(),
          label: nama_grounding_termination
        }))
      : [],
    loadingGroundingList: isPending
  }
}

export { useGetGroundingList }
