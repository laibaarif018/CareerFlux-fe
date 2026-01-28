import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useConnetGoogle } from '@/queries/auth.queries'
import storageService from '@/utils/localstorage'

export const Route = createFileRoute('/auth/connect-google')({
  component: ConnectGoogle,
})

function ConnectGoogle() {
  const navigate = useNavigate()
  const connectgoogle = useConnetGoogle()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [googleId, setGoogleId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedEmail = localStorage.getItem('googleLinkEmail')
    const storedGoogleId = localStorage.getItem('googleLinkId')
    const role = storageService.getItem<string>('userRole')
    setEmail(storedEmail)
    setGoogleId(storedGoogleId)
    setRole(role)
  }, [navigate])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (error) setError('')
    if (connectgoogle.isError) connectgoogle.reset()

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) (nextInput as HTMLInputElement).focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) (prevInput as HTMLInputElement).focus()
    }
  }

  const handleConnectGoogle = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = code.join('')

    if (!otpCode.trim() || otpCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code')
      return
    }

    if (!email || !googleId) return

    setError('')
    connectgoogle.mutate(
      { code: otpCode, email, googleId },
      {
        onSuccess: () => {
          setTimeout(() => {
            if (role === 'jobseeker') {
              window.location.href = '/job-seeker/dashboard'
            } else {
              window.location.href = '/company/dashboard'
            }
          }, 200)
          localStorage.removeItem('googleLinkEmail')
          localStorage.removeItem('googleLinkId')
        },
      },
    )
  }

  const handleCancel = () => {
    localStorage.removeItem('googleLinkEmail')
    localStorage.removeItem('googleLinkId')
    navigate({ to: '/auth/login' })
  }

  const isCodeComplete = code.every((digit) => digit !== '')

  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      }}
    >
      <main className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-[#0E7C8C]/10 border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header Section */}
        <div className="pt-12 pb-6 px-8 text-center bg-gradient-to-b from-[#3EC3BC]/10 to-transparent dark:from-[#0E7C8C]/10 dark:to-transparent">
          <div className="flex items-center justify-center gap-6 mb-8">
            {/* CareerFlux Logo */}
            <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center p-3 animate-float relative group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 450 700"
                width="200"
                height="200"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M0 0 C-0.74173622 12.66283294 -2.40232498 25.22736824 -3.9375 37.8125 C-4.20532785 40.02666252 -4.47290764 42.24085505 -4.74023438 44.45507812 C-6.13315178 55.97344595 -7.54781683 67.48894926 -9 79 C-12.086287 77.51887124 -14.39532257 75.93057874 -16.9375 73.625 C-19.88821097 70.9831485 -22.87744637 68.43949502 -26 66 C-29.21549219 67.37806808 -30.97220001 68.88609739 -33.125 71.625 C-34.6328125 73.5390625 -34.6328125 73.5390625 -36 75 C-36.66 75 -37.32 75 -38 75 C-38.25394531 75.58265625 -38.50789062 76.1653125 -38.76953125 76.765625 C-40.13320333 79.24188033 -41.64225203 80.80520626 -43.6875 82.75 C-46.36200639 85.30123255 -48.8415021 87.94191366 -51.25390625 90.73828125 C-70.16987422 112.53073117 -92.80197348 128.64885402 -117 144 C-117.72880371 144.46341797 -118.45760742 144.92683594 -119.20849609 145.40429688 C-126.77340046 150.21128339 -134.35752903 154.9862518 -141.9765625 159.70703125 C-199.87056765 195.05138882 -199.87056765 195.05138882 -234.94921875 250.8046875 C-236 254 -236 254 -237 256 C-237.99 256 -238.98 256 -240 256 C-245.58499344 239.24501969 -238.30761137 215.34514489 -231 200 C-223.76934169 185.96020158 -213.08949567 174.04643844 -201 164 C-200.43861328 163.52771973 -199.87722656 163.05543945 -199.29882812 162.56884766 C-182.81495867 148.7319911 -165.15200802 136.69527463 -147.33520508 124.66796875 C-117.550809 104.55939574 -88.19075926 83.72271663 -66 55 C-63.81192407 52.33143443 -61.62303379 49.66354019 -59.43359375 46.99609375 C-57.80555292 45.13885027 -57.80555292 45.13885027 -58 43 C-59.61503306 41.77017266 -59.61503306 41.77017266 -61.71875 40.6171875 C-62.86923828 39.95009766 -62.86923828 39.95009766 -64.04296875 39.26953125 C-64.85378906 38.80933594 -65.66460937 38.34914062 -66.5 37.875 C-67.31082031 37.40707031 -68.12164062 36.93914062 -68.95703125 36.45703125 C-70.96762641 35.29798228 -72.98196761 34.14603529 -75 33 C-74 30 -74 30 -70.61474609 28.30517578 C-69.0889328 27.6739292 -67.55803042 27.05490501 -66.0234375 26.4453125 C-65.19780807 26.10699905 -64.37217865 25.76868561 -63.52153015 25.42012024 C-60.81005755 24.31153419 -58.09266864 23.2182979 -55.375 22.125 C-53.51312064 21.36712008 -51.65171315 20.6080799 -49.79077148 19.84790039 C-46.95955822 18.69163188 -44.12801353 17.53625757 -41.29472351 16.38508606 C-35.32867378 13.96011362 -29.38053154 11.49698732 -23.44921875 8.98828125 C-22.72539001 8.68235046 -22.00156128 8.37641968 -21.25579834 8.06121826 C-18.52329658 6.90520507 -15.79141929 5.74776593 -13.0614624 4.58575439 C-11.22065818 3.80280911 -9.37795947 3.02432238 -7.53515625 2.24609375 C-6.507854 1.80966553 -5.48055176 1.3732373 -4.42211914 0.92358398 C-2 0 -2 0 0 0 Z "
                  fill="#32B3AD"
                  transform="translate(265,150)"
                />
                <path
                  d="M0 0 C2.18217113 5.87935279 -1.55690661 11.65053411 -4 17 C-14.21051358 38.5369824 -28.00326072 57.74273457 -44.296875 75.0859375 C-46.3677084 77.31836773 -48.35971271 79.57623981 -50.33984375 81.88671875 C-53.92944362 86.00720923 -57.79652783 89.73699211 -61.8125 93.4375 C-62.51681152 94.09145752 -63.22112305 94.74541504 -63.94677734 95.41918945 C-65.95983131 97.28462562 -67.97848903 99.1437366 -70 101 C-70.91394531 101.84046875 -71.82789063 102.6809375 -72.76953125 103.546875 C-77.3936995 107.74927003 -82.12022424 111.82223287 -86.875 115.875 C-93.39378278 121.43318529 -99.75392266 127.13728968 -106 133 C-106.65484375 133.61230469 -107.3096875 134.22460938 -107.984375 134.85546875 C-113.13702218 139.83084596 -117.56584972 145.38639561 -122 151 C-122.74507813 151.928125 -123.49015625 152.85625 -124.2578125 153.8125 C-138.2215692 171.71724727 -148.78833996 192.75158057 -147 216 C-146.29994856 220.11344096 -145.26624322 224.02661611 -144 228 C-143.7215625 228.8765625 -143.443125 229.753125 -143.15625 230.65625 C-139.8661737 239.84577346 -134.15939867 246.45175473 -126.6015625 252.4921875 C-125 254 -125 254 -124 257 C-138.08781507 258.43753215 -152.97787982 250.22706167 -163.69335938 241.64355469 C-176.60185514 230.57802815 -185.5765226 214.76548347 -187.22460938 197.67016602 C-188.45532985 172.71024688 -181.33544397 151.06970283 -165 132 C-164.35804688 131.236875 -163.71609375 130.47375 -163.0546875 129.6875 C-150.97728289 115.78288657 -136.86977173 104.7524985 -122 94 C-121.31663574 93.50209961 -120.63327148 93.00419922 -119.92919922 92.49121094 C-110.20438754 85.42174693 -100.19975617 78.77652153 -90.1875 72.125 C-63.79495196 54.58817306 -38.52480967 36.75152284 -16.18408203 14.16772461 C-11.09223962 9.03739834 -5.81221155 4.29542827 0 0 Z "
                  fill="#387DC1"
                  transform="translate(233,242)"
                />
                <path
                  d="M0 0 C0.495 0.99 0.495 0.99 1 2 C-0.24316703 4.42219031 -1.54390799 6.72852337 -2.9375 9.0625 C-15.55946326 30.90516558 -23.39859788 53.60888135 -29.29321289 78.09692383 C-29.71074016 79.81188644 -30.14745993 81.52268714 -30.62670898 83.22143555 C-32.46896159 90.14246424 -32.40763046 97.21280322 -32.42553711 104.32641602 C-32.43735033 106.53452395 -32.48657443 108.7397515 -32.53710938 110.94726562 C-32.74144831 129.0262157 -26.81490029 146.57772487 -14.31884766 159.90087891 C-6.28309068 168.018162 2.5788634 172.17011568 14.0144043 172.38110352 C41.58336794 172.31506691 62.00409671 158.31618875 80.88916016 139.35302734 C84.45492142 135.70981267 87.79182137 131.96161452 91 128 C94.32913167 134.65826334 93.05385576 145.81978226 92 153 C89.84896309 157.60406669 87.02721719 159.99538575 83 163 C82.10667969 163.80824219 81.21335937 164.61648438 80.29296875 165.44921875 C69.00723944 175.53072523 55.93977491 183.20459634 42 189 C41.25234375 189.31582031 40.5046875 189.63164063 39.734375 189.95703125 C30.30045406 193.72688548 21.34298646 194.34699944 11.30834961 194.31567383 C9.20178031 194.31252137 7.0966303 194.336015 4.99023438 194.36132812 C-12.5908247 194.44578415 -28.05061905 189.55565487 -40.87182617 177.25097656 C-59.77459572 158.37695891 -66.22436012 134.85827649 -66.25 108.6875 C-66.25100708 107.97513184 -66.25201416 107.26276367 -66.25305176 106.52880859 C-66.24215083 95.11233577 -65.52420273 84.1572903 -63 73 C-62.83951172 72.26313965 -62.67902344 71.5262793 -62.51367188 70.76708984 C-58.99106295 54.81519706 -53.54685694 47.60040127 -41.02734375 37.51953125 C-36.01015003 33.34393132 -31.28399299 28.86046905 -26.51513672 24.40625 C-24.36627044 22.41181401 -22.18494712 20.4547663 -20 18.5 C-15.96929064 14.88694638 -11.97775852 11.23360313 -8 7.5625 C-7.43539062 7.04171875 -6.87078125 6.5209375 -6.2890625 5.984375 C-4.16169518 4.01785741 -2.04873646 2.04873646 0 0 Z "
                  fill="#3A6DC4"
                  transform="translate(198,333)"
                />

                <path
                  d="M0 0 C4.76285919 4.26611928 7.61432356 9.57734795 8.07128906 15.96240234 C8.27005823 27.60426629 8.29057852 38.47479708 4.91015625 49.7109375 C4.58144531 50.82082031 4.25273437 51.93070312 3.9140625 53.07421875 C-1.37603972 69.23740306 -9.88482731 86.6560141 -24.08984375 96.7109375 C-29.33958577 99.2632511 -34.35302334 99.39429405 -40.08984375 98.7109375 C-45.13866933 96.23242312 -49.00787584 92.74548007 -50.9296875 87.35546875 C-51.08984375 84.7109375 -51.08984375 84.7109375 -49.60546875 82.34375 C-48.8578125 81.51617187 -48.11015625 80.68859375 -47.33984375 79.8359375 C-46.51097656 78.87558594 -45.68210937 77.91523438 -44.828125 76.92578125 C-44.38162598 76.40870605 -43.93512695 75.89163086 -43.47509766 75.35888672 C-32.91444061 62.79553898 -24.40963134 48.85795876 -18.08984375 33.7109375 C-17.65671875 32.7209375 -17.22359375 31.7309375 -16.77734375 30.7109375 C-15.72658309 26.12580009 -15.09016432 21.33882409 -16.08984375 16.7109375 C-18.77742725 13.74654297 -20.48220978 12.81374605 -24.4375 12.14453125 C-33.2977376 12.15384801 -40.20524965 13.43602618 -48.08984375 17.7109375 C-49.44142578 18.43796875 -49.44142578 18.43796875 -50.8203125 19.1796875 C-64.35932546 27.15070812 -75.14663368 39.62006793 -86.08984375 50.7109375 C-86.08984375 47.08832589 -85.22073127 46.07823648 -83.1953125 43.125 C-82.57438721 42.20404541 -81.95346191 41.28309082 -81.3137207 40.33422852 C-80.64171631 39.34479248 -79.96971191 38.35535645 -79.27734375 37.3359375 C-73.00522426 27.92961854 -67.45985346 18.36116437 -62.359375 8.27734375 C-61.97241455 7.51244629 -61.5854541 6.74754883 -61.18676758 5.95947266 C-60.45804376 4.46569426 -59.76454234 2.95419306 -59.1081543 1.42724609 C-57.57164601 -2.04137721 -56.72395106 -3.89192587 -53.4453125 -5.9453125 C-35.7025215 -10.67088939 -15.42675997 -11.0311133 0 0 Z "
                  fill="#3B72C3"
                  transform="translate(304.08984375,263.2890625)"
                />
                <path
                  d="M0 0 C0.66 0.99 1.32 1.98 2 3 C0.59155282 6.21524305 -1.10344786 8.32183868 -3.625 10.75 C-4.57246094 11.67039062 -4.57246094 11.67039062 -5.5390625 12.609375 C-6.02117187 13.06828125 -6.50328125 13.5271875 -7 14 C-7 10.11708254 -5.62139506 8.53247465 -3.5 5.3125 C-2.8503125 4.31863281 -2.200625 3.32476562 -1.53125 2.30078125 C-0.77328125 1.16189453 -0.77328125 1.16189453 0 0 Z "
                  fill="#4F7ECA"
                  transform="translate(225,300)"
                />
              </svg>
            </div>

            {/* Plus Icon */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3EC3BC]/20 dark:bg-[#0E7C8C]/20 text-[#0E7C8C] dark:text-[#3EC3BC]">
              <span className="material-symbols-outlined text-2xl font-bold">
                add
              </span>
            </div>

            {/* Google Logo */}
            <div
              className="w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-center p-4 animate-float relative group"
              style={{ animationDelay: '1s' }}
            >
              <svg
                className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
            </div>
          </div>

          <h1
            className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3"
            style={{ letterSpacing: '-0.01em' }}
          >
            Connect with Google
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto font-normal">
            Enter the 6-digit code sent to{' '}
            <strong className="text-slate-700 dark:text-slate-300 font-semibold">
              {email}
            </strong>
          </p>
        </div>

        {/* Content Section */}
        <div className="px-8 pb-10">
          <form className="space-y-6" onSubmit={handleConnectGoogle}>
            {/* OTP Input */}
            <div className="flex justify-center items-center gap-2 sm:gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoFocus={index === 0}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0E7C8C] focus:border-[#0E7C8C] outline-none transition-all shadow-sm"
                />
              ))}
            </div>

            {/* Error Messages */}
            {(error || connectgoogle.isError) && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-base mt-0.5">
                  error
                </span>
                <p className="text-sm text-red-600 dark:text-red-400 font-normal">
                  {error ||
                    (connectgoogle.error as any)?.response?.data?.message ||
                    'Invalid code. Please try again.'}
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Verify Button */}
              <button
                type="submit"
                disabled={!isCodeComplete || connectgoogle.isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#0E7C8C] hover:bg-[#3EC3BC] active:bg-[#0E7C8C]/90 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#0E7C8C]/20 shadow-lg shadow-[#0E7C8C]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {connectgoogle.isPending ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">
                      progress_activity
                    </span>
                    <span className="text-base">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base">Verify & Connect</span>
                    <span className="material-symbols-outlined text-sm">
                      check
                    </span>
                  </>
                )}
              </button>

              {/* Cancel */}
              <button
                type="button"
                onClick={handleCancel}
                className="w-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Terms and Privacy */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-normal">
              By connecting, you agree to our{' '}
              <button
                type="button"
                // onClick={() => navigate({ to: '/terms' })}
                className="text-[#0E7C8C] dark:text-[#3EC3BC] hover:underline font-medium"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                // onClick={() => navigate({ to: '/privacy' })}
                className="text-[#0E7C8C] dark:text-[#3EC3BC] hover:underline font-medium"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
