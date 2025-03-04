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
      // Use the WebOTP API
      const content = await (navigator.credentials as any).get({
        otp: { transport: ['sms'] }
      })

      console.log('SMS Content:', content)

      if (content && 'code' in content) {
        const code = content.code
        console.log('Received code:', code)
        // Update both state and input value
        setOtpCode(code)
        // Force update the input value
        if (inputRef.current) {
          inputRef.current.value = code
        }
      } else {
        setError('کد OTP دریافت نشد')
      }
    } catch (err) {
      console.error('SMS reading error:', err)
      setError('خطا در خواندن پیامک')
    } finally {
      setIsReading(false)
    }
  }

  // Start reading when component mounts
  useEffect(() => {
    const startReading = async () => {
      await readOTP()
    }
    startReading()
  }, [])

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
          defaultValue={otpCode}
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
        <p>Status: {isReading ? 'در حال خواندن...' : 'آماده'}</p>
        {otpCode && <p>کد دریافت شده: {otpCode}</p>}
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
