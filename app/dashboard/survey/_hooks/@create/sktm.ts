import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { surveyKeys } from '../query-key'

export function useCreateSKTMMutation<T>(surveyId: number) {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    T
  >({
    mutationFn: async data => await api.post('/sktm/details', data),
    onSuccess: () => {
      toast.success('SKTM berhasil ditambahkan!')

      queryClient.invalidateQueries({
        queryKey: surveyKeys.detail(surveyId)
      })
    },
    onError: err => {
      toast.error('SKTM gagal ditambahkan, silakan coba lagi!')
      console.error(err)
    }
  })
}
