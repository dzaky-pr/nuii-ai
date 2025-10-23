export type TSurveyStatus = 'Belum_Disetujui' | 'Disetujui'

export interface ISurveyHeader {
  id: number
  nama_survey: string
  lokasi: string
  user_id: string
  status_survey: TSurveyStatus
  updated_at: string
  excel_archive: {
    file_path: string
    file_name: string
  }[]
}

export interface ICreateSurveyHeader {
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  user_id: string
  status_survey: string
  id_material_konduktor: number
}

export interface ISurveyHeaderDetails extends ISurveyHeader {
  sktm_surveys: string[]
  sutm_surveys: string[]
  cubicle_surveys: string[]
}
