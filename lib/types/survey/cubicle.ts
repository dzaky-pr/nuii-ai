export interface ICreateCubicle {
  id_survey_header: number
  petugas_survey: string
  penyulang: string
  long: string
  lat: string
  foto: string
  keterangan: string
  has_grounding: boolean
  id_cubicle_material?: number
  cubicle_type?: string
}
