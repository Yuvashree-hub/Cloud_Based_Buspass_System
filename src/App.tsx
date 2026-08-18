import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AppNavbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import Apply from './pages/Apply'
import MyPass from './pages/MyPass'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import { RequireAuth, RequireAdmin, RedirectIfAuthed } from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <AppNavbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<RedirectIfAuthed><Login /></RedirectIfAuthed>} />
            <Route path="/register" element={<RedirectIfAuthed><Register /></RedirectIfAuthed>} />
            <Route path="/admin/login" element={<RedirectIfAuthed><AdminLogin /></RedirectIfAuthed>} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/apply" element={<RequireAuth><Apply /></RequireAuth>} />
            <Route path="/my-pass" element={<RequireAuth><MyPass /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
