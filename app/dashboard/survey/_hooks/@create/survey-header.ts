import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { ICreateSurveyHeader } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { surveyHeaderKeys } from '../query-key'

export function useCreateSurveyHeaderMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    ICreateSurveyHeader
  >({
    mutationFn: async data => await api.post('/survey', data),
    onSuccess: () => {
      toast.success('Survey berhasil ditambahkan!')

      queryClient.invalidateQueries({ queryKey: surveyHeaderKeys.lists() })
    },
    onError: err => {
      toast.error('Survey gagal ditambahkan, silakan coba lagi!')
      console.error(err)
    }
  })
}
