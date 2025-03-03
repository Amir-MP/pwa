'use client'

import { useEffect, useState, useRef } from 'react'

export default function SMSReader() {
  const [otpCode, setOtpCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const readOTP = async () => {
      if (!('OTPCredential' in window)) {
        setError('WebOTP در این مرورگر پشتیبانی نمی شود')
        return
      }

      try {
        const abortController = new AbortController()
        
        // Start listening for SMS as soon as the page loads
        const credential = await navigator.credentials.get({
          //@ts-ignore
          otp: { transport: ['sms'] },
          signal: abortController.signal
        }) as OTPCredential

        if (credential && credential.code) {
          setOtpCode(credential.code)
          // Automatically set the value in input
          if (inputRef.current) {
            inputRef.current.value = credential.code
            // Optional: trigger input focus
            inputRef.current.focus()
          }
        }

        // Cleanup abort controller
        return () => {
          abortController.abort()
        }
      } catch (err) {
        setError('خطایی رخ داده است: ' + (err instanceof Error ? err.message : String(err)))
      }
    }

    readOTP()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpCode(e.target.value)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">شناسایی کد OTP از پیامک</h1>
      
      <div className="mb-4">
        <label htmlFor="otp-input" className="block mb-2">کد OTP:</label>
        <input
          id="otp-input"
          ref={inputRef}
          type="text"
          className="w-full max-w-xs px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="کد OTP را وارد کنید"
          value={otpCode}
          onChange={handleInputChange}
          pattern="[0-9]*"
          inputMode="numeric"
          maxLength={6}
        />
      </div>

      {error && (
        <div className="text-red-500 mt-2">
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
