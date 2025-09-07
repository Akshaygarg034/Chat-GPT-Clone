'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'

export default function Login() {
  const [loading, setLoading] = useState(false)

  const handleGoogle = async () => {
    try {
      setLoading(true)
      await signIn('google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#0f0f12] via-[#1e1e2a] to-[#101018]">
      {/* Decorative blurred shapes */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl" />

      {/* Centered card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Brand */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Image
                src="https://res.cloudinary.com/dz1vsgxm5/image/upload/v1757192404/ChatGPTClone/icons8-chatgpt-100_l7tpts.png"
                alt="App logo"
                width={88}
                height={88}
                priority
                className="drop-shadow-[0_6px_20px_rgba(0,0,0,0.25)]"
              />
            </div>
            <h1 className="text-2xl font-semibold text-white">Welcome</h1>
            <p className="mt-1 text-sm text-gray-300">
              Sign in to continue to your workspace
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3 font-medium text-gray-900 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-60"
            >
              {/* Google icon */}
              <span className="inline-flex h-5 w-5 items-center justify-center rounded">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.7 3.1 14.5 2 12 2 6.9 2 2.8 6.1 2.8 11.2S6.9 20.4 12 20.4c7.3 0 9-5.1 8.6-8.2H12z"/>
                </svg>
              </span>
              <span className="relative">
                {loading ? 'Redirecting…' : 'Continue with Google'}
              </span>
            </button>
          </div>

          {/* Terms */}
          <p className="mt-6 text-center text-xs text-white/50">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
