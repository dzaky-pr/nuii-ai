import { TSurveyStatus } from '../types/survey'

export const CHAT_ID = 'search' as const

export const jobOptions = [
  { value: 'Pasang Baru', label: 'Pasang Baru' },
  { value: 'Perubahan Daya', label: 'Perubahan Daya' },
  { value: 'PFK', label: 'PFK' },
  { value: 'Konfigurasi Jaringan', label: 'Konfigurasi Jaringan' },
  { value: 'Penyulang Baru', label: 'Penyulang Baru' }
]

export const surveyStatusOptions = [
  { value: 'Belum_Disetujui', label: 'Belum Disetujui' },
  { value: 'Disetujui', label: 'Disetujui' }
]

export const surveyStatus: Record<TSurveyStatus, string> = {
  Belum_Disetujui: 'Belum Disetujui',
  Disetujui: 'Disetujui'
}
