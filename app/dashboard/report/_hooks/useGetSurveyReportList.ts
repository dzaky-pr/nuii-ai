import api from '@/lib/tools/api'
import { SurveyHeader } from '@/lib/types/survey'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyReportList = () => {
  return useQuery<SurveyHeader[]>({
    queryKey: ['surveyReportList'],
    queryFn: async () => {
      const response = await api.get('/survey/report')
      return response.data.data
    }
  })
}

export { useGetSurveyReportList }
