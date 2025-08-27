interface BaseCreateSKTM {
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
}

export interface ICreateFirstSKTM extends BaseCreateSKTM {
  id_termination_masuk: number
}

export interface ICreateSKTM extends BaseCreateSKTM {
  id_sktm_survey: number
  id_termination_keluar: number
}
