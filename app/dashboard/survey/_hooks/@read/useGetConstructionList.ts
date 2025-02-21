import api from '@/lib/tools/api'
import { IConstructionLite } from '@/lib/types/construction'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

const useGetConstructionList = () => {
  const { data, isPending } = useQuery<IConstructionLite[]>({
    queryKey: ['constructionList'],
    queryFn: async () => {
      const response = await api.get('/konstruksi/list')
      return response.data.data
    },
    placeholderData: keepPreviousData
  })

  return {
    constructionList: isPending
      ? []
      : data
      ? data.map(({ id, nama_konstruksi }) => ({
          value: id.toString(),
          label: nama_konstruksi
        }))
      : [],
    loadingConstructionList: isPending
  }
}

export { useGetConstructionList }
