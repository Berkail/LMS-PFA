import ReLct from 'react'

export const metadata = {
  title: 'Signup to my cool app',
  description: 'Just a normal signup page'
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