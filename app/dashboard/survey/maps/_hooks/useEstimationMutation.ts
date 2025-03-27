import useRouteStore from '@/lib/hooks/useRouteStore'
import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { IEstimation, IMaps } from '@/lib/types/maps'
import { setCookie } from '@/lib/utils/cookies'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useEstimationMutation = () => {
  const { setEstimation } = useRouteStore()

  return useMutation<
    AxiosResponse<ApiResponse<IEstimation>>,
    AxiosError<ApiError>,
    IMaps
  >({
    mutationFn: async data => await api.post('/estimasi', data),
    onSuccess: response => {
      console.log(response)
      setEstimation(response.data.data)
      setCookie('routing-mode', 'view')
    },
    onError: () => {
      toast.error('Gagal mendapatkan estimasi')
    }
  })
}

export { useEstimationMutation }
