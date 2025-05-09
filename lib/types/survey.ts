import { IMaterial } from './material'

export type TSurveyStatus = 'Belum_Disetujui' | 'Disetujui'

export interface SurveyHeader {
  excel_archive: { file_path: string; file_name: string }[]
  id: number
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  status_survey: TSurveyStatus
  user_id: string
  id_material_konduktor: number | string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface DetailedSurveyHeader extends SurveyHeader {
  total_panjang_jaringan_manual: number
  total_panjang_jaringan_otomatis: number
}

export interface SurveyDetail {
  id: number
  id_material_tiang: number
  id_konstruksi: number
  id_pole_supporter: number
  id_grounding_termination: number
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

export interface SurveyDetailExtended
  extends Omit<SurveyDetail, 'id_pole_supporter' | 'id_grounding_termination'> {
  id_pole_supporter?: string
  id_grounding_termination?: number
  nama_konstruksi?: string
  nama_material_tiang?: string
  nama_grounding_termination?: string
  nama_pole_supporter?: string
}

export interface ISurvey {
  header: DetailedSurveyHeader
  detail: SurveyDetail[]
}

export interface ISurveyExtended {
  header: DetailedSurveyHeader
  detail: SurveyDetailExtended[]
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

export interface EditSurveyDetailForm extends SurveyDetailExtended {}

export interface UpdateSurveyHeader {
  id_header: number
  header: Omit<SurveyHeader, 'id'>
}

export interface UpdateSurveyDetail {
  id_detail: number
  detail: Omit<SurveyDetailExtended, 'id'>
}

export interface SurveyLite {
  id: number
  nama_survey: string
}

interface TotalMaterial {
  total_kuantitas: number
  total_berat: number
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
