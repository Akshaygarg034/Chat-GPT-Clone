import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import Ss from "../components/Ss";
import Image from "next/image"

function page() {
  return (
    <div className="">
      <div className="md:hidden">
        <Ss />
      </div>
      <div className="text-white flex flex-col items-center justify-center h-screen px-2 cursor-pointer">
        <div className="flex gap-3 items-start justify-center">
          <Image
                src="https://res.cloudinary.com/dz1vsgxm5/image/upload/v1757192404/ChatGPTClone/icons8-chatgpt-100_l7tpts.png"
                width={200}
                height={200}
                alt="logo"
                className="h-14 w-14"
            />
          <h1 className="text-5xl font-bold mb-16">ChatGPT</h1>
        </div>

        <div className="flex text-center space-x-4 mb-16">
          <div>
            <div className="flex flex-col items-center justify-center mb-5">
              {/* Sunicon */}
              <SunIcon className="h-8 w-8" />
              <h2>Examples</h2>
            </div>

            <div className="space-y-4">
              <p className="infotext in">
                "Explain quantum computing in simple terms"→
              </p>
              <p className="infotext in">
                "Got any creative ideas for a 10 year old's birthday?"→
              </p>
              <p className="infotext in">
                "How do I make an HTTP request in Javascript?"→
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center mb-5">
              {/* Bolticon */}
              <BoltIcon className="h-8 w-8" />
              <h2>Capabilities</h2>
            </div>

            <div className="space-y-4">
              <p className="infotext in">
                Trained to decline inappropriate requests
              </p>
              <p className="infotext in">
                Messages are stored in Firebase's Firestore
              </p>
              <p className="infotext in">
                Hot Toast notifications when ChatGPT is thinking!
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col items-center justify-center mb-5">
              {/* ExclamationTriangleIcon */}
              <ExclamationTriangleIcon className="h-8 w-8" />
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
