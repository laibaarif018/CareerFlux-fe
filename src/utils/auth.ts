
export function getAuthToken() {
  if (typeof document === 'undefined') {
    return null // running on server
  }

  const match = document.cookie.match(/(^| )access_token=([^;]+)/)
  return match ? match[2] : null
}



