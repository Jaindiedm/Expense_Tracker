import { Routes, Route, Navigate} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Profile from './pages/Profile';

function App() {

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path='/register' element={<Register />}/>

      {/* Protected routes — redirects to /login if not authenticated */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
      <Route path="/income" element={<ProtectedRoute><Income /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Catch-all route to redirect unknown paths to dashboard */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>

  )
}

export default App
