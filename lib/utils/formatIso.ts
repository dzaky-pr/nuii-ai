export function formatISOtoGMT7(isoDate: string): string {
  // Parse ISO date dan konversi ke waktu UTC (dalam milidetik)
  const date = new Date(isoDate)
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000

  // Tambah 7 jam untuk GMT+7
  const gmt7Time = new Date(utcTime + 7 * 3600000)

  // Daftar nama hari dalam bahasa Indonesia
  const dayNames = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu'
  ]
  const dayName = dayNames[gmt7Time.getDay()]

  // Format tanggal dengan leading zero
  const day = String(gmt7Time.getDate()).padStart(2, '0')
  const month = String(gmt7Time.getMonth() + 1).padStart(2, '0')
  const year = gmt7Time.getFullYear()
  const hours = String(gmt7Time.getHours()).padStart(2, '0')
  const minutes = String(gmt7Time.getMinutes()).padStart(2, '0')

  return `${dayName}, ${day}/${month}/${year} ${hours}:${minutes} WIB`
}
