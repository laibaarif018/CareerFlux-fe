
export function getAuthToken() {
  if (typeof document === 'undefined') {
    return null // running on server
  }

  const match = document.cookie.match(/(^| )access_token=([^;]+)/)
  return match ? match[2] : null
}


// export function getUserFromToken() {
//   const token = getAuthToken();
//   if (!token) return null;

//   try {
//     const decoded: any = jwt_decode.jwtDecode(token);
//     console.log('Decoded JWT:', decoded);
//     return { id: decoded.sub, role: decoded.role, name: decoded.name, email: decoded.email };
//   } catch {
//     return null;
//   }
// }

