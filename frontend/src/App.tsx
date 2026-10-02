import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Programs from './pages/Programs'
import Membership from './pages/Membership'
import Coaches from './pages/Coaches'
import Facilities from './pages/Facilities'
import Events from './pages/Events'
import Gallery from './pages/Gallery'
import Book from './pages/Book'
import Donate from './pages/Donate'
import Contact from './pages/Contact'
import Legal from './pages/Legal'
import PaymentResult from './pages/PaymentResult'
import NotFound from './pages/NotFound'

// Admin is code-split so public visitors never download it.
const AdminLayout = lazy(() => import('./admin/components/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const Login = lazy(() => import('./admin/pages/Login'))
const Dashboard = lazy(() => import('./admin/pages/Dashboard'))
const Bookings = lazy(() => import('./admin/pages/Bookings'))
const Donations = lazy(() => import('./admin/pages/Donations'))
const Enquiries = lazy(() => import('./admin/pages/Enquiries'))
const CatalogEditor = lazy(() => import('./admin/pages/CatalogEditor'))

function AdminRoutes() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="p-10 text-mute">Loading…</div>}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="donations" element={<Donations />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="catalog" element={<CatalogEditor />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/coaches" element={<Coaches />} />
        <Route path="/facilities" element={<Facilities />} />
        <Route path="/events" element={<Events />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/book" element={<Book />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal slug="privacy" />} />
        <Route path="/terms" element={<Legal slug="terms" />} />
        <Route path="/refund-policy" element={<Legal slug="refund-policy" />} />
        <Route path="/safety-rules" element={<Legal slug="safety-rules" />} />
        <Route path="/payment/success" element={<PaymentResult ok />} />
        <Route path="/payment/failed" element={<PaymentResult ok={false} />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
