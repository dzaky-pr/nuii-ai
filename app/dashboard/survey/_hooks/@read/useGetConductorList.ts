import api from '@/lib/tools/api'
import { IMaterial } from '@/lib/types/material'
import { useQuery } from '@tanstack/react-query'

const useGetConductorList = () => {
  const { data, isPending } = useQuery<IMaterial[]>({
    queryKey: ['conductorList'],
    queryFn: async () => {
      const response = await api.get('/material/list/konduktor')
      return response.data.data
    }
  })

  return {
    conductorList: isPending
      ? []
      : data
      ? data.map(({ id, nama_material }) => ({
          value: id.toString(),
          label: nama_material
        }))
      : [],
    loadingConductorList: isPending
  }
}

export { useGetConductorList }
