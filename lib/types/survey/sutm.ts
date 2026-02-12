import {
  IGroundingTermination,
  IKonstruksi,
  IMaterial,
  IPoleSupporter
} from './material'

export interface ISutmDetail {
  id: number
  id_sutm_survey: number
  id_material_tiang: number
  id_konstruksi: number
  id_pole_supporter: number | null
  id_grounding_termination: number | null
  penyulang: string
  panjang_jaringan: number
  long: string
  lat: string
  foto: string
  keterangan: string
  petugas_survey: string
  material_tiang?: IMaterial
  konstruksi?: IKonstruksi
  pole_supporter?: IPoleSupporter
  grounding_termination?: IGroundingTermination
}

export interface ISutmSurvey {
  id: number
  id_survey_header: number
  id_material_konduktor: number
  sutm_details: ISutmDetail[]
  material_konduktor?: IMaterial
}

export interface ICreateFirstSUTM {
  id_survey_header: number
  id_material_konduktor: number
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
}

export interface ICreateSUTM {
  id_sutm_survey: number
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
}
