import { Routes, Route } from 'react-router-dom'
import './App.css'
import RegisterClient from './pages/RegisterClient'
import Clients from './pages/Clients'
import ClientDetails from './pages/ClientDetails'


function App() {

  return (
    <Routes>

      <Route 
        path='/'
        element={<Clients />}
      />
      
      <Route 
        path='/register'
        element={<RegisterClient />}
      />

      <Route 
        path='/clients/:clientId'
        element={<ClientDetails />}
      />

    </Routes>
  )
}

export default App
