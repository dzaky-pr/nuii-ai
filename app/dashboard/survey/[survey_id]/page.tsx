import DetailSurveyPage from '../_pages/DetailSurvey'

export default async function DetailSurveyPageWrapper({
  params
}: {
  params: Promise<{ survey_id: string }>
}) {
  const surveyId = (await params).survey_id

  return <DetailSurveyPage surveyId={surveyId} />
}
