'use client'

import { useEffect, useState, useRef } from 'react'

export default function SMSReader() {
  const [otpCode, setOtpCode] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isReading, setIsReading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const readOTP = async () => {
    if (!('OTPCredential' in window)) {
      setError('WebOTP در این مرورگر پشتیبانی نمی شود')
      return
    }

    setIsReading(true)
    setError('')

    try {
      const abortController = new AbortController()

      // Start listening for SMS
      const credential = await navigator.credentials.get({
        otp: {
          transport: ['sms'],
          signal: abortController.signal
        }
      }) as any

      console.log('Received credential:', credential)

      if (credential?.code) {
        console.log('Received OTP code:', credential.code)
        setOtpCode(credential.code)
        if (inputRef.current) {
          inputRef.current.value = credential.code
          inputRef.current.focus()
        }
      }
    } catch (err) {
      console.error('OTP Error:', err)
      setError('خطایی رخ داده است: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setIsReading(false)
    }
  }

  // Start reading OTP when component mounts
  useEffect(() => {
    readOTP()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setOtpCode(value)
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
          autoComplete="one-time-code"
        />
      </div>

      <button 
        onClick={readOTP}
        disabled={isReading}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isReading ? 'در حال خواندن...' : 'خواندن مجدد کد'}
      </button>

      {error && (
        <div className="text-red-500 mt-2">
          <p>{error}</p>
        </div>
      )}

      {/* Debug display */}
      <div className="text-sm text-gray-500 mt-2">
        <p>Status: {isReading ? 'Reading SMS...' : 'Ready'}</p>
        {otpCode && <p>Detected code: {otpCode}</p>}
      </div>
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
