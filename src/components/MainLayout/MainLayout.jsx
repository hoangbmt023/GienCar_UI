import Header from '@/components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../Footer/Footer'

export default function MainLayout() {
  return (
    <>
      <Header />

      <main className="pt-16">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}