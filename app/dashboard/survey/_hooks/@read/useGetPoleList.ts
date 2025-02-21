import api from '@/lib/tools/api'
import { IMaterial } from '@/lib/types/material'
import { useQuery } from '@tanstack/react-query'

const useGetPoleList = () => {
  const { data, isPending } = useQuery<IMaterial[]>({
    queryKey: ['poleList'],
    queryFn: async () => {
      const response = await api.get('/material/list/tiang')
      return response.data.data
    }
  })
  return {
    poleList: isPending
      ? []
      : data
      ? data.map(({ id, nama_material }) => ({
          value: id.toString(),
          label: nama_material
        }))
      : [],
    loadingPoleList: isPending
  }
}

export { useGetPoleList }
