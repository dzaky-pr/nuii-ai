import DetailReportPage from '../_pages/DetailReportPage'

export default async function DetailReportPageWrapper({
  params
}: {
  params: Promise<{ report_id: string }>
}) {
  const reportId = (await params).report_id

  return <DetailReportPage reportId={reportId} />
}
