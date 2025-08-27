interface BaseSUTM {
  id: number
  id_survey_header: number
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

export interface ICreateFirstSUTM extends Omit<BaseSUTM, 'id'> {
  id_material_konduktor: number
}

export interface ICreateSUTM extends Omit<BaseSUTM, 'id'> {
  id_sutm_survey: number
}

export interface IDetailSUTM extends BaseSUTM, ICreateSUTM, ICreateSUTM {}

export interface IUpdateHeaderSUTM {
  id_material_konduktor: number
}

export interface IUpdateDetailSUTM {
  id_material_tiang: number
  petugas_survey: string
}
