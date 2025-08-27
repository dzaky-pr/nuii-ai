import api from '@/lib/tools/api'
import { SurveyLite } from '@/lib/types/old-survey'
import { useQuery } from '@tanstack/react-query'

export function useGetSurveyNames() {
  const { data, isPending } = useQuery<SurveyLite[]>({
    queryKey: ['surveyNames', 'list'],
    queryFn: async () => {
      const response = await api.get('/survey/name-list')
      return response.data.data
    }
  })

  return {
    surveyNames: isPending
      ? []
      : data
      ? data.map(({ id, nama_survey }) => ({
          value: id.toString(),
          label: nama_survey
        }))
      : [],
    loadingSurveyNames: isPending
  }
}
