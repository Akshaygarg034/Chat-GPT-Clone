'use client'
import { signIn } from "next-auth/react"
import Image from "next/image"

const Login = () => {

    return (

        <div className="bg-[#353541] h-screen flex flex-col items-center justify-center text-center">
            <Image
                src="https://res.cloudinary.com/dz1vsgxm5/image/upload/v1757192404/ChatGPTClone/icons8-chatgpt-100_l7tpts.png"
                width={200}
                height={200}
                alt="logo"
            />
            <button onClick={() => signIn("google")} className="text-white font-bold text-3xl animate-pulse">Sign In to use ChatGPT</button>
        </div>
    )

}

export default Login    