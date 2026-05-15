import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFab from '../components/layout/WhatsAppFab'
import HeroSection from '../components/home/HeroSection'
import ProductCatalog from '../components/home/ProductCatalog'
import CTABanner from '../components/home/CTABanner'

export default function HomePage() {
  return (
    <div className="bg-[#0b0b0b] text-slate-100 min-h-screen">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <ProductCatalog />
        <CTABanner />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  )
}
