import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppShell from './components/AppShell'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import PendingPage from './pages/PendingPage'
import DashboardPage from './pages/DashboardPage'
import ApprovalsPage from './pages/ApprovalsPage'
import VehiclesPage from './pages/VehiclesPage'
import DriversPage from './pages/DriversPage'
import TripsPage from './pages/TripsPage'
import TrackingPage from './pages/TrackingPage'
import NotFoundPage from './pages/NotFoundPage'

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/pending-approval" element={<PendingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/drivers" element={<DriversPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
