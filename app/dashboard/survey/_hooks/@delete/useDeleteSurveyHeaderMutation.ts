import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { SurveyHeader } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useDeleteSurveyHeaderMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<SurveyHeader>>,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: async surveyId => api.delete(`/survey/delete/${surveyId}`),
    onSuccess: () => {
      toast.success('Survey berhasil dihapus!')

      queryClient.invalidateQueries({ queryKey: ['surveyHeaderList'] })
    },
    onError: err => {
      toast.error('Survey gagal dihapus, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useDeleteSurveyHeaderMutation }
