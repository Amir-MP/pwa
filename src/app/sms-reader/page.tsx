'use client'

import { useEffect, useState } from 'react'

export default function SMSReader() {
  const [otpCode, setOtpCode] = useState('')
  const [error, setError] = useState('')
  const [isReading, setIsReading] = useState(false)

  const handleReadOTP = async () => {
    if (!('OTPCredential' in window)) {
      setError('WebOTP در این مرورگر پشتیبانی نمی شود')
      return
    }

    setIsReading(true)
    setError('')

    try {
      const abortController = new AbortController()

      // Use the WebOTP API directly
      const result = await (window as any).OTPCredential.receive({
        otp: { transport: ['sms'] },
        signal: abortController.signal
      })

      console.log('SMS Result:', result)

      if (result) {
        // Extract just the numbers from the result
        const code = result.replace(/\D/g, '')
        console.log('Extracted code:', code)
        setOtpCode(code)
      }

    } catch (err) {
      console.error('Error reading SMS:', err)
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('خطا در خواندن پیامک')
      }
    } finally {
      setIsReading(false)
    }
  }

  // Start listening for OTP when component mounts
  useEffect(() => {
    if ('OTPCredential' in window) {
      // Add event listener for WebOTP
      const ac = new AbortController()
      
      navigator.credentials.get({
        //@ts-ignore
        otp: {
          transport: ['sms']
        },
        signal: ac.signal
      }).then(result => {
        //@ts-ignore
        if (result?.code) {
          //@ts-ignore
          console.log('OTP received:', result.code)
          //@ts-ignore
          setOtpCode(result.code)
        }
      }).catch(err => {
        console.error('OTP Error:', err)
      })

      return () => {
        ac.abort()
      }
    }
  }, [])

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">شناسایی کد OTP از پیامک</h1>
      
      <div className="w-full max-w-xs space-y-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="_ _ _ _ _ _"
            maxLength={6}
            pattern="[0-9]*"
            inputMode="numeric"
            autoComplete="one-time-code"
          />
        </div>

        <button 
          onClick={handleReadOTP}
          disabled={isReading}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {isReading ? 'در حال خواندن پیامک...' : 'خواندن مجدد پیامک'}
        </button>

        {error && (
          <div className="text-red-500 text-center p-2 rounded-lg bg-red-50">
            {error}
          </div>
        )}

        {otpCode && (
          <div className="text-green-600 text-center p-2 rounded-lg bg-green-50">
            کد تایید با موفقیت دریافت شد
          </div>
        )}

        {/* Debug info */}
        <div className="text-xs text-gray-500">
          <p>WebOTP supported: {String('OTPCredential' in window)}</p>
          <p>Current status: {isReading ? 'Reading...' : 'Ready'}</p>
        </div>
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
