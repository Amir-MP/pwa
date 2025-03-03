'use client'

import { useEffect, useState } from 'react'

export default function SMSReader() {
  const [otpCode, setOtpCode] = useState<string>('')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const readOTP = async () => {
      if (!('OTPCredential' in window)) {
        setError('WebOTP is not supported in this browser')
        return
      }

      try {
        const abortController = new AbortController()
        
        const credential = await navigator.credentials.get({
          //@ts-ignore
          otp: { transport: ['sms'] },
          signal: abortController.signal
        }) as OTPCredential

        if (credential && credential.code) {
          setOtpCode(credential.code)
        }
      } catch (err) {
        setError('خطایی رخ داده است: ' + (err instanceof Error ? err.message : String(err)))
      }
    }

    readOTP()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">شناسایی کد OTP از پیامک</h1>
      
      {otpCode && (
        <div className="mb-4">
          <p>کد OTP شناسایی شده: <span className="font-bold text-green-500">{otpCode}</span></p>
        </div>
      )}

      {error && (
        <div className="text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  )
}

// Add TypeScript interface for OTPCredential since it might not be recognized
declare global {
  interface Window {
    OTPCredential: any
  }
  
  interface OTPCredential extends Credential {
    code: string
  }
}
