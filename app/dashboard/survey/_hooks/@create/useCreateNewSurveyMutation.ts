import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { CreateNewSurvey, ISurvey } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useCreateNewSurveyMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<ISurvey>>,
    AxiosError<ApiError>,
    CreateNewSurvey
  >({
    mutationFn: async data => await api.post('/survey/create-new', data),
    onSuccess: () => {
      toast.success('Survey baru berhasil dibuat!')

      queryClient.invalidateQueries({ queryKey: ['surveyHeaderList'] })
    },
    onError: err => {
      toast.error('Survey baru gagal dibuat, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useCreateNewSurveyMutation }
