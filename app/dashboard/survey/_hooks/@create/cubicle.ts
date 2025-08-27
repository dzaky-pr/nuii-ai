import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'
import { surveyKeys } from '../query-key'

export function useCreateCubicleMutation<T>(surveyId: number) {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    T
  >({
    mutationFn: async data => await api.post('/cubicle/create', data),
    onSuccess: () => {
      toast.success('Cubicle berhasil ditambahkan!')

      queryClient.invalidateQueries({
        queryKey: surveyKeys.detail(surveyId)
      })
    },
    onError: err => {
      toast.error('Cubicle gagal ditambahkan, silakan coba lagi!')
      console.error(err)
    }
  })
}
