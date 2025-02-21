import { IMaterial } from './material'

export interface SurveyHeader {
  id: number
  nama_survey: string
  lokasi: string
  status_survey: string
  user_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SurveyDetail {
  id: number
  id_material_tiang: number
  id_material_konduktor: number
  id_konstruksi: number
  nama_pekerjaan: string
  penyulang: string
  panjang_jaringan: number
  long: string
  lat: string
  foto: string
  keterangan: string
  petugas_survey: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ISurvey {
  header: SurveyHeader
  detail: SurveyDetail[]
}

export interface CreateExistingSurvey {
  id_header: number
  detail: Omit<SurveyDetail, 'id'>
}

export interface CreateNewSurvey {
  header: Omit<SurveyHeader, 'id'>
  detail: Omit<SurveyDetail, 'id'>
}

export interface CreateSurveyForm {
  id_header: number
  header: Omit<SurveyHeader, 'id'>
  detail: Omit<SurveyDetail, 'id'>
}

export interface EditSurveyHeaderForm extends SurveyHeader {}

export interface EditSurveyDetailForm extends SurveyDetail {}

export interface UpdateSurveyHeader {
  id_header: number
  header: Omit<SurveyHeader, 'id'>
}

export interface UpdateSurveyDetail {
  id_detail: number
  detail: Omit<SurveyDetail, 'id'>
}

export interface SurveyLite {
  id: number
  nama_survey: string
}

interface TotalMaterial {
  total_kuantitas: number
  total_harga_material: number
  total_pasang: number
  total_bongkar: number
}

interface DetailMaterial extends IMaterial, TotalMaterial {}

export interface SurveyRAB {
  data_survey: SurveyHeader & {
    survey_details: SurveyDetail[]
    detail_tiang: DetailMaterial[]
    detail_konstruksi: {
      idKonstruksi: number
      material: DetailMaterial[]
    }[]
  }
}
