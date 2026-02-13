import api from '@/lib/tools/api'
import { ISurveyHeader } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyReportList = () => {
  return useQuery<ISurveyHeader[]>({
    queryKey: ['surveyReportList'],
    queryFn: async () => {
      const response = await api.get('/survey/reports')
      return response.data.data
    }
  })
}

export { useGetSurveyReportList }
