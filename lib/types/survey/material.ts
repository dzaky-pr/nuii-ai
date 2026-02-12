export interface IMaterial {
  id: number
  id_tipe_material: number
  nomor_material: number
  nama_material: string
  satuan_material: string | null
  berat_material: string | null
  harga_material: number | null
  pasang_rab: number | null
  bongkar: number | null
  jenis_material: string | null
  kategori_material: string | null
}

export interface IKonstruksi {
  id: number
  nama_konstruksi: string
  nomor_konstruksi: number
}

export interface IPoleSupporter {
  id: number
  nama_pole: string
}

export interface IGroundingTermination {
  id: number
  nama_grounding: string
}
