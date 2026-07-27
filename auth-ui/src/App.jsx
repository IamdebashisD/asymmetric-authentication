import { Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Consent from './pages/Consent'


function App() {

  return (
    <Routes>
      <Route path='/login' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/consent' element={<Consent />}/>
    </Routes>
  )
}

export default App
