import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import {
  UploadExcelArchivePayload,
  UploadExcelArchiveResponse
} from '@/lib/types/report'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useUploadExcelArchiveMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<ApiResponse<UploadExcelArchiveResponse>>, // response biasanya success message
    AxiosError<ApiError>,
    UploadExcelArchivePayload
  >({
    mutationFn: async (payload: UploadExcelArchivePayload) => {
      return await api.post('/excel-archive', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    onSuccess: () => {
      toast.success('File excel berhasil diupload!')
      queryClient.invalidateQueries({ queryKey: ['surveyReportList'] })
    },
    onError: error => {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Gagal upload file, silakan coba lagi!'

      toast.error(message)
    }
  })
}

export { useUploadExcelArchiveMutation }
