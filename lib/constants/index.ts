import { SurveyHeader } from '../types/survey'

export const CHAT_ID = 'search' as const

export const jobOptions = [
  'Pasang Baru',
  'Perubahan Daya',
  'PFK',
  'Konfigurasi Jaringan',
  'Penyulang Baru'
]

export const surveyStatus: Record<SurveyHeader['status_survey'], string> = {
  Belum_Disetujui: 'Belum Disetujui',
  Disetujui: 'Disetujui'
}
