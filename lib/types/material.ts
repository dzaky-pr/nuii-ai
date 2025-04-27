export interface IMaterial {
  id: number
  id_tipe_material: number
  nomor_material: number
  nama_material: string
  satuan_material: string
  berat_material: string
  harga_material: number
  pasang_rab: number
  bongkar: number
  jenis_material: string
  kategori_material: string
}

export type IMaterialWithTimestamps = IMaterial & {
  created_at: string // ISO date string
  updated_at: string // ISO date string
  deleted_at: string | null
}

export type IMaterialWithLog = Omit<
  IMaterialWithTimestamps,
  'nomor_material'
> & {
  id_material: number
  tipe_log: string
}

export interface IGroundingLite {
  id: string
  nama_grounding_termination: string
}

export interface IPoleLite {
  id: string
  nama_pole_supporter: string
}
