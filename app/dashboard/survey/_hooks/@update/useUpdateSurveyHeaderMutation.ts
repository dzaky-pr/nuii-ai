'use client'

import api from '@/lib/tools/api'
import { ApiError, ApiResponse } from '@/lib/types/api'
import { SurveyHeader, UpdateSurveyHeader } from '@/lib/types/survey'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useUpdateSurveyHeaderMutation = ({ surveyId }: { surveyId: string }) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation<
    AxiosResponse<ApiResponse<SurveyHeader>>,
    AxiosError<ApiError>,
    UpdateSurveyHeader
  >({
    mutationFn: async data => await api.put('/survey/update-header', data),
    onSuccess: async () => {
      toast.success('Header survey berhasil diperbarui!')

      await queryClient.invalidateQueries({ queryKey: ['surveyHeaderList'] })
      await queryClient.invalidateQueries({
        queryKey: ['surveyDetail', surveyId]
      })

      // 👉 Tambahkan ini:
      await queryClient.invalidateQueries({
        queryKey: ['surveyHeader', surveyId]
      })

      router.prefetch(`/dashboard/survey/${surveyId}`)
    },
    onError: err => {
      toast.error('Header survey gagal diperbarui, silakan coba lagi!')
      console.error(err)
    }
  })
}

export { useUpdateSurveyHeaderMutation }
