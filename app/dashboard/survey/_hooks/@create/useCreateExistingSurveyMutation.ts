import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { CreateExistingSurvey, ISurvey } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useCreateExistingSurveyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<ISurvey>>,
    AxiosError<ApiError>,
    CreateExistingSurvey
  >({
    mutationFn: async data => await api.post('/survey/create', data),
    onSuccess: () => {
      toast.success('Survey berhasil dibuat!')

      queryClient.invalidateQueries({ queryKey: ['surveyHeaderList'] })
    },
    onError: err => {
      toast.error('Survey gagal dibuat, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useCreateExistingSurveyMutation }
