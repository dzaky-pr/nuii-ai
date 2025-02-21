import api from '@/lib/tools/api'
import { SurveyLite } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyNameList = () => {
  const { data, isPending } = useQuery<SurveyLite[]>({
    queryKey: ['surveyNameList'],
    queryFn: async () => {
      const response = await api.get('/survey/name-list')
      return response.data.data
    }
  })

  return {
    surveyNameList: isPending
      ? []
      : data
      ? data.map(({ id, nama_survey }) => ({
          value: id.toString(),
          label: nama_survey
        }))
      : [],
    loadingSurveyNameList: isPending
  }
}

export { useGetSurveyNameList }
