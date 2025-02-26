import api from '@/lib/tools/api'
import { SurveyReport } from '@/lib/types/report'
import { useQuery } from '@tanstack/react-query'

const useGetSurveyReportDetail = (surveyId: string) => {
  return useQuery<SurveyReport>({
    queryKey: ['surveyReport', surveyId],
    queryFn: async () => {
      const response = await api.get(`/survey/export/${surveyId}`)
      return response.data.data
    },
    enabled: !!surveyId
  })
}

export { useGetSurveyReportDetail }
