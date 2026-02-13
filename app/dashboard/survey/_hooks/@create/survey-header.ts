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

export function useDeleteSurveyHeaderMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: async id => await api.delete(`/survey/${id}`),
    onSuccess: () => {
      toast.success('Survey berhasil dihapus!')

      queryClient.invalidateQueries({ queryKey: surveyHeaderKeys.lists() })
    },
    onError: err => {
      toast.error('Survey gagal dihapus, silakan coba lagi!')
      console.error(err)
    }
  })
}

export function useUpdateSurveyHeaderMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    { id: number } & ICreateSurveyHeader
  >({
    mutationFn: async ({ id, ...data }) =>
      await api.put('/survey/update-header', {
        id_header: id,
        header: data
      }),
    onSuccess: () => {
      toast.success('Survey berhasil diupdate!')

      queryClient.invalidateQueries({ queryKey: surveyHeaderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: surveyHeaderKeys.details() })
    },
    onError: err => {
      toast.error('Survey gagal diupdate, silakan coba lagi!')
      console.error(err)
    }
  })
}
