import api from '@/lib/tools/api'
import { ISurveyExtended } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyDetail = (surveyId: string) => {
  return useQuery<ISurveyExtended>({
    queryKey: ['surveyDetail', surveyId],
    queryFn: async () => {
      const response = await api.get(`/survey/detail/${surveyId}`)
      return response.data.data
    },
    enabled: !!surveyId
  })
}

export { useGetSurveyDetail }
