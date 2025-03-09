'use client'

import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { IMaterialWithTimestamps } from '@/lib/types/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useDeleteMaterialMutation = () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<
    AxiosResponse<ApiResponse<IMaterialWithTimestamps>>,
    AxiosError<ApiError>,
    number
  >({
    mutationFn: async (materialId: number) => {
      return await api.delete(`/material/delete/${materialId}`)
    },
    onSuccess: () => {
      toast.success('Material berhasil dihapus!')
      // Invalidate query key yang sesuai, misalnya 'materials'
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      router.push('/dashboard/manage-materials')
    },
    onError: err => {
      toast.error('Gagal menghapus material, silakan coba lagi.')
      console.error(err)
    }
  })
}

export { useDeleteMaterialMutation }
