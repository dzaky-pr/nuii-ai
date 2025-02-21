import api from '@/lib/tools/api'
import { ApiError, ApiReturn } from '@/lib/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const useDeleteSurveyMutation = ({ isHeader }: { isHeader: boolean }) => {
  const queryClient = useQueryClient()

  return useMutation<AxiosResponse<ApiReturn>, AxiosError<ApiError>, number>({
    mutationFn: async surveyId =>
      api.delete(
        isHeader
          ? `/survey/delete/${surveyId}`
          : `/survey/detail/delete/${surveyId}`
      ),
    onSuccess: (data, surveyId) => {
      toast.success(
        `${isHeader ? 'Survey' : 'Detail survey'} berhasil dihapus!`
      )

      queryClient.invalidateQueries({
        queryKey: isHeader ? ['surveyHeaderList'] : ['detailSurvey', surveyId]
      })
    },
    onError: err => {
      toast.error(
        `${
          isHeader ? 'Header' : 'Detail'
        } survey gagal dihapus, silakan coba lagi!`
      )
      console.error(err)
    }
  })
}

export { useDeleteSurveyMutation }
