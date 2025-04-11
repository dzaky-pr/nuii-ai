import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { IBatch } from '@/lib/types/maps'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useCreateBatchMutation = () => {
  return useMutation<
    AxiosResponse<ApiResponse<IBatch>>,
    AxiosError<ApiError>,
    IBatch
  >({
    mutationFn: async data => await api.post('/survey/create-batch', data),
    onSuccess: () => {
      toast.success('Survey baru berhasil dibuat!')
    },
    onError: () => {
      toast.error('Gagal mendapatkan estimasi')
    }
  })
}

export { useCreateBatchMutation }
