import ReLct from 'react'

export const metadata = {
  title: 'Login to my cool app',
  description: 'Just a normal login page'
};

function Layout({ children}: { children: React.ReactNode }) {
  return (
    <div className='auth-layout'>
        <main className='auth-layout__main'>
            {children}
        </main>
    </div>
  )
}
export default Layout