import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
// import './App.css'

import Home from './pages/Home/Home'
import Product from './pages/Product/Product'
import Invoice from './pages/Invoice/Invoice'
import Statistics from './pages/Statistics/Statistics'
import Setting from './pages/Setting/Setting'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import Otp from './pages/Auth/Otp'
import CreateNewPassword from './pages/Auth/CreateNewPassword'
import RefreshHandler from './RefreshHandler'
import AppLayout from './pages/AppLayout'
import { SearchProvider } from './context/SearchContext'

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	const PrivateRoute = ({ element }) => {
		return isAuthenticated ? element : <Navigate to='/login' />
	}

	return (
		<div className='App'>
			<RefreshHandler setIsAuthenticated={setIsAuthenticated} />
			<ToastContainer />
			<SearchProvider>
				<Routes> 
					{/* Auth Routes */}
					<Route path='/' element={<Navigate to='/login' />} />
					<Route path='/login' element={<Login />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/forgot-password' element={<ForgotPasswordPage />} />
					<Route path='/verify-otp' element={<Otp />} />
					<Route path='/reset-password' element={<CreateNewPassword />} />

					{/* Private routes with AppLayout */}
					<Route element={<AppLayout />}>
						<Route
							path='/home'
							// element={<Home />}
							element={<PrivateRoute element={<Home />} />}
						/>
						<Route
							path='/product'
							// element={<Product />}
							element={<PrivateRoute element={<Product />} />}
						/>
						<Route
							path='/invoice'
							// element={<Invoice />}
							element={<PrivateRoute element={<Invoice />} />}
						/>
						<Route
							path='/statistics'
							// element={<Statistics />}
							element={<PrivateRoute element={<Statistics />} />}
						/>
						<Route
							path='/setting'
							// element={<Setting />}
							element={<PrivateRoute element={<Setting />} />}
						/>
					</Route>
				</Routes>
			</SearchProvider>
		</div>
	)
}

export default App
