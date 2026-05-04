import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import Ss from "../components/Ss";

function page() {
  return (
    <div className="">
      <div className="md:hidden">
        <Ss />
      </div>
      <div className="text-[#ececec] flex flex-col items-center justify-center h-screen px-2">
        <div className="flex gap-3 items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#8B5CF6"/></linearGradient>
              <filter id="homeGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <circle cx="110" cy="110" r="90" fill="none" stroke="url(#homeGrad)" strokeWidth="4" opacity="0.3"/>
            <circle cx="110" cy="110" r="28" fill="url(#homeGrad)" filter="url(#homeGlow)"/>
            <g stroke="url(#homeGrad)" strokeWidth="3" strokeLinecap="round">
              <line x1="110" y1="82" x2="110" y2="50"/><line x1="138" y1="110" x2="170" y2="110"/><line x1="110" y1="138" x2="110" y2="170"/><line x1="82" y1="110" x2="50" y2="110"/>
              <line x1="130" y1="90" x2="155" y2="65"/><line x1="130" y1="130" x2="155" y2="155"/><line x1="90" y1="130" x2="65" y2="155"/><line x1="90" y1="90" x2="65" y2="65"/>
            </g>
            <g fill="url(#homeGrad)">
              <circle cx="110" cy="45" r="6"/><circle cx="175" cy="110" r="6"/><circle cx="110" cy="175" r="6"/><circle cx="45" cy="110" r="6"/>
              <circle cx="160" cy="60" r="5"/><circle cx="160" cy="160" r="5"/><circle cx="60" cy="160" r="5"/><circle cx="60" cy="60" r="5"/>
            </g>
          </svg>
          <h1 className="text-5xl font-bold mb-2">LLM Chat Bot</h1>
        </div>

        <p className="text-[#888] mb-14 mt-2">Powered by Gemini 2.5 Flash</p>

        <div className="flex text-center space-x-4 mb-16">
          <div>
            <div className="flex flex-col items-center justify-center mb-5">
              <SunIcon className="h-8 w-8 text-sky-400" />
              <h2>Examples</h2>
            </div>

            <div className="space-y-4">
              <p className="infotext in">
                "Explain quantum computing in simple terms" →
              </p>
              <p className="infotext in">
                "Got any creative ideas for a 10 year old's birthday?" →
              </p>
              <p className="infotext in">
                "How do I make an HTTP request in Javascript?" →
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center mb-5">
              <BoltIcon className="h-8 w-8 text-violet-400" />
              <h2>Capabilities</h2>
            </div>

            <div className="space-y-4">
              <p className="infotext in">
                Multimodal — send images alongside text
              </p>
              <p className="infotext in">
                Remembers context with conversation memory
              </p>
              <p className="infotext in">
                Fast responses powered by Gemini 2.5 Flash
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center mb-5">
              <ExclamationTriangleIcon className="h-8 w-8 text-sky-400" />
              <h2>Limitations</h2>
            </div>

            <div className="space-y-4">
              <p className="infotext in">
                May occasionally generate incorrect information
              </p>
              <p className="infotext in">
                May occasionally produce harmful instructions or biased content
              </p>
              <p className="infotext in">Limited knowledge of world and events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
