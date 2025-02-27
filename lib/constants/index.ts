import { TSurveyStatus } from '../types/survey'

export const CHAT_ID = 'search' as const

export const jobOptions = [
  'Pasang Baru',
  'Perubahan Daya',
  'PFK',
  'Konfigurasi Jaringan',
  'Penyulang Baru'
]

export const surveyStatusOptions = [
  { value: 'Belum_Disetujui', label: 'Belum Disetujui' },
  { value: 'Disetujui', label: 'Disetujui' }
]

export const surveyStatus: Record<TSurveyStatus, string> = {
  Belum_Disetujui: 'Belum Disetujui',
  Disetujui: 'Disetujui'
}
