import { IDetailAppTm } from './app-tm'
import { IDetailCubicle } from './cubicle'
import { IDetailSUTM } from './sutm'

export type TSurveyStatus = 'Belum_Disetujui' | 'Disetujui'

export interface ISurveyHeader {
  id: number
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  status_survey: TSurveyStatus
  user_id: string
}

export interface ICreateSurveyHeader {
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  user_id: string
  status_survey: string
  id_material_konduktor: number
}

export interface ISurveySequence {
  id: number
  survey_header_id: number
  survey_detail_id: number
  tipe: 'SUTM' | 'SKTM' | 'CUBICLE' | 'APP_TM'
  urutan: number
  keterangan: string
}

export interface ISurveyHeaderDetails extends ISurveyHeader {
  survey_sequence: ISurveySequence[]
  sktm_surveys: string[]
  sutm_surveys: IDetailSUTM[]
  cubicle_surveys: IDetailCubicle[]
  app_tm_surveys: IDetailAppTm[]
}
