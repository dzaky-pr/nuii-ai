export interface ICreateCubicle {
  id_survey_header: number
  id_cubicle_material?: number
  cubicle_type?: string
  has_grounding: boolean
  penyulang: string
  long: string
  lat: string
  foto: string
  keterangan: string
  petugas_survey: string
}

export interface IDetailCubicle
  extends Omit<ICreateCubicle, 'id_cubicle_material' | 'cubicle_type'> {
  id: number
  id_cubicle_material: number | null
  cubicle_type: string | null
}
