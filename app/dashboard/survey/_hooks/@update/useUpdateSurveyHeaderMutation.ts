import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { SurveyHeader, UpdateSurveyHeader } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useUpdateSurveyHeaderMutation = ({ surveyId }: { surveyId: string }) => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<SurveyHeader>>,
    AxiosError<ApiError>,
    UpdateSurveyHeader
  >({
    mutationFn: async data => await api.put('/survey/update-header', data),
    onSuccess: () => {
      toast.success('Header survey berhasil diperbarui!')

      queryClient.invalidateQueries({ queryKey: ['surveyHeaderList'] })
      queryClient.invalidateQueries({
        queryKey: ['surveyDetail', surveyId]
      })
    },
    onError: err => {
      toast.error('Header survey gagal diperbarui, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useUpdateSurveyHeaderMutation }
