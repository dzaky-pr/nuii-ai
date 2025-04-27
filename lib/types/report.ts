export interface SurveyReport {
  data_survey: DataSurvey
  detail_poles: DetailPole[]
  detail_tiang: Detail[]
  detail_konstruksi: DetailKonstruksi[]
  detail_konduktor: Detail[]
}

export interface DataSurvey {
  id: number
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  status_survey: string
  id_material_konduktor: number
  user_id: string
  created_at: string
  updated_at: string
  survey_details: SurveyDetail[]
}

export interface SurveyDetail {
  id: number
  id_material_tiang: number
  id_konstruksi: number
  id_header: number
  id_pole_supporter: number
  id_grounding_termination: number | null
  penyulang: string
  panjang_jaringan: number
  long: string
  lat: string
  foto: string
  keterangan: string
  petugas_survey: string
  created_at: string
  updated_at: string
  deleted_at: null
}

export interface Detail {
  data_konduktor?: DataKonduktorClass
  total_kuantitas: number
  total_berat: number
  total_harga_material: number
  total_pasang: number
  total_bongkar: number
  data_tiang?: DataKonduktorClass
}

export interface DataKonduktorClass {
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
  created_at: string
  updated_at: string
  deleted_at: null
}

export interface DetailKonstruksi {
  idKonstruksi: number
  data_konstruksi: DataKonstruksi
  materials: Material[]
  detail_grounding: DetailGrounding[]
}

export interface DataKonstruksi {
  id: number
  nama_konstruksi: string
  nomor_konstruksi: number
  created_at: string
  updated_at: string
  deleted_at: null
}

export interface DetailGrounding {
  idGrounding: number
  idKonstruksi: number
  data_grounding: DataPoleClass
  materials: Material[]
}

export interface DataPoleClass {
  id: number
  nama_grounding?: string
  created_at: string
  updated_at: string
  deleted_at: null
  nama_pole?: string
}

export interface Material {
  data_material: DataKonduktorClass
  tipe_pekerjaan: string
  kuantitas: string
  total_kuantitas: number
  total_berat: number
  total_harga_material: number
  total_pasang: number
  total_bongkar: number
}

export interface DetailPole {
  idPole: number
  data_pole: DataPoleClass
  materials: Material[]
}

export interface SurveyHeader {
  id: number
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  status_survey: string
  id_material_konduktor: number
  user_id: string
  created_at: string
  updated_at: string
}

export interface SurveyArchive {
  archive_id: number
  file_name: string
  file_path: string
  survey_header_id: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface UploadExcelArchiveResponse {
  code: number
  message: string
  status: boolean
  data: {
    header: SurveyHeader
    archive: SurveyArchive
  }
}

export interface UploadExcelArchivePayload {
  header: {
    nama_survey: string
    nama_pekerjaan: string
    lokasi: string
    user_id: string
    id_material_konduktor: number
  }
  file: {
    file_name: string
    file_path: string
  }
}

export interface UploadFormValues {
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  user_id: string
  id_material_konduktor: string
  file_path: string
}
