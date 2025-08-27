import api from '@/lib/tools/api'
import { ISurveyHeaderDetails } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'
import { surveyKeys } from '../query-key'

const useGetSurveyDetail = (surveyId: string) => {
  return useQuery<ISurveyHeaderDetails>({
    queryKey: surveyKeys.detail(Number(surveyId)),
    queryFn: async () => {
      const response = await api.get(`/survey/${surveyId}`)
      return response.data.data
    },
    enabled: !!surveyId
  })
}

export { useGetSurveyDetail }
