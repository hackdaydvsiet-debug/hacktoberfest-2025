import Login from "./pages/Login.jsx";
// import Signup from "./pages/Signup.jsx";
import Signup from "./pages/signup_test.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { Route, Routes,Navigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './contexts/authContext.jsx';
import Contact from "./pages/Contact.jsx";

function App() {
  const { user } = useContext(AuthContext);
	return (
		<div>
    
			<Routes>
				<Route path='/' element={user ? <Dashboard /> : <Navigate to={"/login"} />} />
				<Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
				<Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
				<Route path='*' element={<Navigate to={"/login"} />} />
				<Route path='/contact' element={<Contact />} />
        </Routes>
    </div>
  );
}

export default App;
