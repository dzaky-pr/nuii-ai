import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { SurveyDetail } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useDeleteSurveyDetailMutation = ({ surveyId }: { surveyId: string }) => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<SurveyDetail>>,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: async detailId =>
      api.delete(`/survey/detail/delete/${detailId}`),
    onSuccess: () => {
      toast.success('Detail survey berhasil dihapus!')

      queryClient.invalidateQueries({
        queryKey: ['surveyDetail', surveyId]
      })
    },
    onError: err => {
      toast.error('Detail survey gagal dihapus, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useDeleteSurveyDetailMutation }
