import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'

function FadeIn({ children }) {
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [location])

  return (
    <div className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FadeIn><Landing /></FadeIn>} />
      <Route path="/dashboard" element={<FadeIn><Dashboard /></FadeIn>} />
    </Routes>
  )
}
