'use client'

import { signIn } from 'next-auth/react'
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
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#111]">
      {/* Decorative blurred shapes */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

      {/* Centered card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          {/* Brand */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <svg width="80" height="80" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient>
                  <filter id="loginGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                </defs>
                <circle cx="110" cy="110" r="90" fill="none" stroke="url(#loginGrad)" strokeWidth="4" opacity="0.3"/>
                <circle cx="110" cy="110" r="28" fill="url(#loginGrad)" filter="url(#loginGlow)"/>
                <g stroke="url(#loginGrad)" strokeWidth="3" strokeLinecap="round">
                  <line x1="110" y1="82" x2="110" y2="50"/><line x1="138" y1="110" x2="170" y2="110"/><line x1="110" y1="138" x2="110" y2="170"/><line x1="82" y1="110" x2="50" y2="110"/>
                  <line x1="130" y1="90" x2="155" y2="65"/><line x1="130" y1="130" x2="155" y2="155"/><line x1="90" y1="130" x2="65" y2="155"/><line x1="90" y1="90" x2="65" y2="65"/>
                </g>
                <g fill="url(#loginGrad)">
                  <circle cx="110" cy="45" r="6"/><circle cx="175" cy="110" r="6"/><circle cx="110" cy="175" r="6"/><circle cx="45" cy="110" r="6"/>
                  <circle cx="160" cy="60" r="5"/><circle cx="160" cy="160" r="5"/><circle cx="60" cy="160" r="5"/><circle cx="60" cy="60" r="5"/>
                </g>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white">LLM Chat Bot</h1>
            <p className="mt-1 text-sm text-[#888]">
              Sign in to start chatting
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3 font-medium text-gray-900 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-60"
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
          <p className="mt-6 text-center text-xs text-white/40">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
