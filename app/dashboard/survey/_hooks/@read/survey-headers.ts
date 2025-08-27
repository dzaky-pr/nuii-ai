import api from '@/lib/tools/api'
import { ISurveyHeader } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'
import { surveyKeys } from '../query-key'

export function useGetSurveyHeaderList() {
  return useQuery<ISurveyHeader[]>({
    queryKey: surveyKeys.lists(),
    queryFn: async () => {
      const response = await api.get('/survey')
      return response.data.data
    }
  })
}
