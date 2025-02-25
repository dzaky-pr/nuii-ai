import api from '@/lib/tools/api'
import { ISurvey } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyReport = (surveyId: string) => {
  return useQuery<ISurvey>({
    queryKey: ['exportSurvey', surveyId],
    queryFn: async () => {
      const response = await api.get(`/survey/export/${surveyId}`)
      return response.data.data
    },
    enabled: !!surveyId
  })
}

export { useGetSurveyReport }
