import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { IMaterial } from '@/lib/types/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useCreateMaterialMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<IMaterial>>,
    AxiosError<ApiError>,
    {
      id_tipe_material: number
      nama_material: string
      nomor_material: number
      satuan: string
      berat: number
      harga_material: number
      pasang_rab: number
      bongkar: number
      jenis_material: string
      kategori_material: string
    }
  >({
    mutationFn: async data => await api.post('/material/create', data),
    onSuccess: () => {
      toast.success('Material baru berhasil dibuat!')
      queryClient.invalidateQueries({ queryKey: ['allList'] })
    },
    onError: err => {
      toast.error('Material baru gagal dibuat, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useCreateMaterialMutation }
