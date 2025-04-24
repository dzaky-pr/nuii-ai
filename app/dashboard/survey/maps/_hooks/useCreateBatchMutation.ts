import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { IBatch } from '@/lib/types/maps'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useCreateBatchMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation<
    AxiosResponse<ApiResponse<IBatch>>,
    AxiosError<ApiError>,
    IBatch
  >({
    mutationFn: async data => await api.post('/survey/create-batch', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveyNameList'] })
      toast.success('Survey baru berhasil dibuat!')
	  router.push('/dashboard/survey')
    },
    onError: () => {
      toast.error('Gagal mendapatkan estimasi')
    }
  })
}

export { useCreateBatchMutation }

