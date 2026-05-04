import { SessionProvider } from '../components/SessionProvider'
import SideBar from '../components/SideBar'
import { getServerSession } from 'next-auth'
import '../styles/globals.css'
import { authOptions } from '../pages/api/auth/[...nextauth]'
import Login from '../components/Login'
import ClientProvider from '../components/ClientProvider'
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession(authOptions)
  return (
    <html>
      <head />
      <body>
        <SessionProvider session={session}>

          {!session ? (
            <Login />
          ) : (

            <div className='flex'>
              {/* sidebar */}
              <div className='bg-[#171717] max-w-xs h-screen overflow-y-auto md:min-w-[20rem] hidden md:block scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#424242]/80 hover:scrollbar-thumb-[#616161]'>

                <SideBar />
              </div>

              {/* client provider */}
              <ClientProvider />

              <div className="bg-[#212121] flex-1">
                {children}
              </div>
            </div>

          )}


        </SessionProvider>


      </body>
    </html>
  )
}
