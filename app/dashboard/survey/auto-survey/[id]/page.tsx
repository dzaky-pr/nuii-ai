import AutoSUTMDetailPage from '../../_pages/AutoSUTMDetail'

export default async function AutoSUTMDetailPageWrapper({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const surveyId = (await params).id

  return <AutoSUTMDetailPage surveyId={surveyId} />
}