import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/poppins'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'

import { useAuthContext } from './hooks/useAuthContext'
import useLoading from './hooks/useLoading'
import Header from './components/common/Header'
import Loading from './components/common/Loading'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import PageNotFound from './pages/PageNotFound'
import mainTheme from './styles/mainTheme'

const App = () => {
  const { authIsReady, user } = useAuthContext()

  const { setOpenLoading } = useLoading()

  useEffect(() => {
    if (authIsReady) setOpenLoading(false)
  }, [authIsReady, setOpenLoading])

  console.log('APP')
  console.log('user', user)

  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      <Router>
        <Header />
        {!authIsReady ? (
          <Loading />
        ) : (
          <Routes>
            <Route
              path="/"
              element={!user ? <Navigate to="/login" /> : <Navigate to="/dashboard" />}
            />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/sign-up" element={!user ? <SignUp /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route
              path="/forgot-password"
              element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  )
}

export default App
