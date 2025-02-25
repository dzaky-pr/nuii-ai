import api from '@/lib/tools/api'
import { IMaterial } from '@/lib/types/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const useGetTiangList = () => {
  const { data, isPending } = useQuery<IMaterial[]>({
    queryKey: ['tiangList'],
    queryFn: async () => {
      const response = await api.get('/material/list/tiang')
      return response.data.data
    },
    placeholderData: keepPreviousData
  })
  return {
    listTiang: isPending
      ? []
      : data
      ? data.map(({ id, nama_material }) => ({
          value: id.toString(),
          label: nama_material
        }))
      : [],
    loadingListTiang: isPending
  }
}

export { useGetTiangList }
