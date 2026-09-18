'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Zap, BarChart3, ShieldCheck, Loader2 } from 'lucide-react'
import { Logo } from '@/components/shared/logo'
import { useSession, signIn } from 'next-auth/react'

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto redirect if logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handleLogin = async () => {
    setIsLoggingIn(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  if (!mounted || status === 'loading') return <div className="min-h-screen bg-white"></div> 

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-hidden font-sans selection:bg-emerald-500/20 relative">
      
      {/* Background Accent Shapes */}
      <div className="absolute top-0 left-[-5%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Fixed Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center text-black">
            <Logo className="text-black [&_span]:text-black" />
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-700">
            <a href="#platform" className="hover:text-blue-600 transition-colors flex items-center gap-1">Platform <span className="text-[10px] opacity-50">▼</span></a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#resources" className="hover:text-blue-600 transition-colors flex items-center gap-1">Resources <span className="text-[10px] opacity-50">▼</span></a>
          </div>

          <div className="flex items-center gap-5">
            {session ? (
              <button onClick={() => router.push('/dashboard')} className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-md">
                Go to Dashboard
              </button>
            ) : (
              <>
                <button onClick={handleLogin} className="hidden sm:block px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors">
                  Log In
                </button>
                <button 
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:-translate-y-0.5 flex items-center justify-center min-w-[120px]"
                >
                  {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Started'}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-24 pb-20 md:pt-32 md:pb-24 px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[85vh]">
        
        <div className="flex-1 text-center lg:text-left z-10 max-w-2xl mt-8 lg:mt-0">
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight leading-[1.15] mb-6 text-slate-900 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Grow Your Audience <br className="hidden lg:block"/>
            with Seamless Email <br className="hidden lg:block"/>
            Marketing for <span className="text-emerald-500">FreeMail</span>
          </h1>
          
          <p className="text-[17px] text-slate-600 max-w-lg mx-auto lg:mx-0 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 font-medium">
            Powerful, intuitive tools to create, send, and analyze beautiful email campaigns. Start your free account instantly.
          </p>

          <div className="flex flex-col items-center lg:items-start gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
            <button 
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-[320px] relative flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-slate-200 text-slate-800 rounded-xl font-semibold text-[15px] hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md disabled:opacity-80 disabled:cursor-not-allowed group"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  Authenticating...
                </>
              ) : (
                <>
                  {/* Google Logo SVG */}
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            <p className="text-[13px] text-slate-500 font-medium mt-1">No credit card required. Free plan available.</p>
          </div>
        </div>

        {/* Uploaded Hero Visual */}
        <div className="flex-1 w-full max-w-[420px] flex justify-end animate-in fade-in zoom-in-95 duration-1000 delay-200">
          <div className="relative w-full aspect-square flex items-center justify-center">
            <img 
              src="/images/freemail_landing_light_1789749737617.svg" 
              alt="Email Marketing Illustration" 
              className="w-full h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
              draggable="false"
            />
          </div>
        </div>

      </main>

      {/* Brands Section */}
      <section className="bg-white pb-16 pt-8">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
          <h3 className="text-xl font-bold text-slate-800">TC TechCrunch</h3>
          <h3 className="text-2xl font-bold text-slate-800 tracking-tighter">zapier</h3>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">P</div> Product Hunt</h3>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 border-t border-slate-100 bg-white text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Logo className="text-black [&_span]:text-black" />
        </div>
        <div className="text-sm font-medium text-slate-500 flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <span>© 2026 FreeMail Inc. All rights reserved.</span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span>Powered by <a href="https://x010.tech" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">x010.tech</a></span>
        </div>
      </footer>

    </div>
  )
}
