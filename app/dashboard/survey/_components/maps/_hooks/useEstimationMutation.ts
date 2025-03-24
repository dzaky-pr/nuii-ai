import api from '@/lib/tools/api'
import { ApiError } from '@/lib/types/api'
import { IMaps } from '@/lib/types/maps'
import { useMutation } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'

const useEstimationMutation = () => {
  return useMutation<AxiosResponse, AxiosError<ApiError>, IMaps>({
    mutationFn: data => api.post('/estimasi', data)
  })
}

export { useEstimationMutation }
