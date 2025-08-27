export interface ISurveyHeader {
  id: number
  nama_survey: string
  lokasi: string
  user_id: string
  status_survey: string
}

export interface ICreateSurveyHeader {
  nama_survey: string
  nama_pekerjaan: string
  lokasi: string
  user_id: string
  status_survey: string
}

export interface ISurveyHeaderDetails extends ISurveyHeader {
  sktm_surveys: string[]
  sutm_surveys: string[]
  cubicle_surveys: string[]
}
