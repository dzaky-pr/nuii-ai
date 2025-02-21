import api from '@/lib/tools/api'
import { SurveyRAB } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyRAB = (surveyId: string) => {
  return useQuery<SurveyRAB>({
    queryKey: ['surveyRAB', surveyId],
    queryFn: async () => {
      const response = await api.get(`/survey/export/${surveyId}`)
      return response.data.data
    },
    enabled: !!surveyId
  })
}

export { useGetSurveyRAB }
