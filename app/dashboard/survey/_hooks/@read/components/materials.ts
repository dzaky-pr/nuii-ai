import api from '@/lib/tools/api'
import { IMaterial } from '@/lib/types/survey'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

type MaterialType = 'accessory' | 'kabel' | 'jointing' | 'terminasi'
type SurveyType = 'SUTM' | 'SKTM' | 'CUBICLE' | 'APP-TM'

export function useGetMaterials(type: MaterialType, survey: SurveyType) {
  const { data, isPending } = useQuery<IMaterial[]>({
    queryKey: ['materials', 'list', type, survey],
    queryFn: async () => {
      const response = await api.get('/material/survey', {
        params: {
          table: `${type}Material`,
          survey
        }
      })
      return response.data.data
    },
    placeholderData: keepPreviousData
  })

  return {
    materials: isPending
      ? []
      : data
      ? data.map(({ id_material, nama_material }) => ({
          value: id_material.toString(),
          label: nama_material
        }))
      : [],
    loadingMaterials: isPending
  }
}
