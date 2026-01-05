// src/utils/auth.ts
export function getAuthToken() {
  if (typeof document === 'undefined') {
    return null // running on server
  }

  const match = document.cookie.match(/(^| )access_token=([^;]+)/)
  return match ? match[2] : null
}

// export function getAuthToken(): string | null {
//   // Handle SSR (server-side rendering)
//   if (typeof document === 'undefined') {
//     return null
//   }

//   const match = document.cookie.match(/(^| )access_token=([^;]+)/)
//   return match ? match[2] : null
// }

// export function setAuthToken(token: string, days: number = 7): void {
//   if (typeof document === 'undefined') return

//   const expires = new Date(Date.now() + days * 864e5).toUTCString()
//   document.cookie = `access_token=${token}; expires=${expires}; path=/; SameSite=Lax`
// }

// export function removeAuthToken(): void {
//   if (typeof document === 'undefined') return

//   document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
// }
