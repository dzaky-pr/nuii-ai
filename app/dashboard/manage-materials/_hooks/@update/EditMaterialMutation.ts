import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { IMaterialWithTimestamps } from '@/lib/types/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

export interface UpdateMaterial {
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

const useUpdateMaterialMutation = ({ materialId }: { materialId: number }) => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<IMaterialWithTimestamps>>,
    AxiosError<ApiError>,
    UpdateMaterial
  >({
    mutationFn: async (data: UpdateMaterial) => {
      return await api.put(`/material/update/${materialId}`, data)
    },
    onSuccess: () => {
      toast.success('Material berhasil diperbarui!')
      queryClient.invalidateQueries({ queryKey: ['material', materialId] })
    },
    onError: err => {
      toast.error('Gagal memperbarui material, silakan coba lagi.')
      console.error(err)
    }
  })
}

export { useUpdateMaterialMutation }
