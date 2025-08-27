import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { surveyKeys } from '../query-key'

export function useCreateSUTMMutation<T>(surveyId: number) {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    T
  >({
    mutationFn: async data => await api.post('/sutm/create', data),
    onSuccess: () => {
      toast.success('SUTM berhasil ditambahkan!')

      queryClient.invalidateQueries({
        queryKey: surveyKeys.detail(surveyId)
      })
    },
    onError: err => {
      toast.error('SUTM gagal ditambahkan, silakan coba lagi!')
      console.error(err)
    }
  })
}
