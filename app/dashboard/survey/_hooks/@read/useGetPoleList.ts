import api from '@/lib/tools/api'
import { IPoleLite } from '@/lib/types/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const useGetPoleList = () => {
  const { data, isPending } = useQuery<IPoleLite[]>({
    queryKey: ['poleList'],
    queryFn: async () => {
      const response = await api.get('/pole/list')
      return response.data.data
    },
    placeholderData: keepPreviousData
  })

  return {
    poleList: isPending
      ? []
      : data
      ? data.map(({ id, nama_pole_supporter }) => ({
          value: id.toString(),
          label: nama_pole_supporter
        }))
      : [],
    loadingPoleList: isPending
  }
}

export { useGetPoleList }
