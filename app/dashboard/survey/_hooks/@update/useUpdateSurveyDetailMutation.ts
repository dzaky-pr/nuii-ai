import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { SurveyDetail, UpdateSurveyDetail } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useUpdateSurveyDetailMutation = ({ surveyId }: { surveyId: string }) => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<SurveyDetail>>,
    AxiosError<ApiError>,
    UpdateSurveyDetail
  >({
    mutationFn: async data => await api.put('/survey/update-detail', data),
    onSuccess: () => {
      toast.success('Detail survey berhasil diperbarui!')

      queryClient.invalidateQueries({
        queryKey: ['surveyDetail', surveyId]
      })
    },
    onError: err => {
      toast.error('Detail survey gagal diperbarui, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useUpdateSurveyDetailMutation }
