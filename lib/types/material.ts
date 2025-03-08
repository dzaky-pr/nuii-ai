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
  created_at?: string // ISO date string
  updated_at?: string // ISO date string
  deleted_at?: string | null
}

export interface IGroundingLite {
  id: string
  nama_grounding: string
}

export interface IPoleLite {
  id: string
  nama_pole: string
}
