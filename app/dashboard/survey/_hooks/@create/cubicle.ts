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

export function useUpdateCubicleMutation(surveyId: number) {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    { id: number; data: any }
  >({
    mutationFn: async ({ id, data }) =>
      await api.put(`/cubicle/update/${id}`, data),
    onSuccess: () => {
      toast.success('Cubicle berhasil diupdate!')

      queryClient.invalidateQueries({
        queryKey: surveyKeys.detail(surveyId)
      })
    },
    onError: err => {
      toast.error('Cubicle gagal diupdate, silakan coba lagi!')
      console.error(err)
    }
  })
}

export function useDeleteCubicleMutation(surveyId: number) {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<unknown>>,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: async id => await api.delete(`/cubicle/delete/${id}`),
    onSuccess: () => {
      toast.success('Cubicle berhasil dihapus!')

      queryClient.invalidateQueries({
        queryKey: surveyKeys.detail(surveyId)
      })
    },
    onError: err => {
      toast.error('Cubicle gagal dihapus, silakan coba lagi!')
      console.error(err)
    }
  })
}
