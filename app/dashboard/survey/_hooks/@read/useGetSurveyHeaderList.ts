import api from '@/lib/tools/api'
import { SurveyHeader } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyHeaderList = () => {
  return useQuery<SurveyHeader[]>({
    queryKey: ['surveyHeaderList'],
    queryFn: async () => {
      const response = await api.get('/survey')
      return response.data.data
    }
  })
}

export { useGetSurveyHeaderList }
