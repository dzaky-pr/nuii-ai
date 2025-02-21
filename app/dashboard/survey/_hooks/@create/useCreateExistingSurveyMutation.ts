import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { CreateExistingSurvey, ISurvey } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useCreateExistingSurveyMutation = ({
  surveyId
}: {
  surveyId?: string
}) => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<ISurvey>>,
    AxiosError<ApiError>,
    CreateExistingSurvey
  >({
    mutationFn: async data => await api.post('/survey/create', data),
    onSuccess: () => {
      toast.success('Survey berhasil ditambahkan!')

      queryClient.invalidateQueries({ queryKey: ['surveyHeaderList'] })
      queryClient.invalidateQueries({
        queryKey: ['surveyDetail', surveyId]
      })
    },
    onError: err => {
      toast.error('Survey gagal ditambahkan, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useCreateExistingSurveyMutation }
