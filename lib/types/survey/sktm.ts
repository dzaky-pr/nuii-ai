export interface ISktmDetail {
  id: number
  id_sktm_survey: number
  penyulang: string
  panjang_jaringan: number
  diameter_kabel: number
  long: string
  lat: string
  foto: string
  keterangan: string
  petugas_survey: string
  has_arrester: boolean | null
}

import { IMaterial } from './material'

export interface ISktmSurvey {
  id: number
  id_survey_header: number
  sktm_details: ISktmDetail[]
  sktm_components: {
    material: IMaterial
    kuantitas: number
    keterangan: string | null
  }[]
  sktm_joints: {
    material_joint: IMaterial
    material_kabel: IMaterial
    lat: string
    long: string
  }[]
}

export interface ICreateFirstSKTM {
  id_survey_header: number
  penyulang: string
  panjang_jaringan: number
  diameter_kabel: number
  long: string
  lat: string
  foto: string
  keterangan: string
  petugas_survey: string
  has_arrester: boolean
  id_termination_masuk: number
  id_kabel: number
}

export interface ICreateSKTM {
  id_sktm_survey: number
  penyulang: string
  panjang_jaringan: number
  diameter_kabel: number
  long: string
  lat: string
  foto: string
  keterangan: string
  petugas_survey: string
  has_arrester: boolean
  id_termination_keluar: number
}
