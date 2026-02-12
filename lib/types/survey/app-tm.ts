import { IMaterial } from './material'

export interface IDetailAppTm {
  id: number
  id_survey_header: number
  keterangan: string
  penyulang: string
  long: string
  lat: string
  foto: string
  AppTmComponent: {
    material: IMaterial
    kuantitas: number
    keterangan: string | null
  }[]
}
