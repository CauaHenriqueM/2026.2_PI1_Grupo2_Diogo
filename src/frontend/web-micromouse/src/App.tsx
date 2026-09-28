import { Route, Routes } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { LabirintoPage } from './pages/LabirintoPage'

function App() {
  return (
    <div className="flex h-screen w-screen bg-[#08111F] sm:flex-row flex-col ">
      <Sidebar></Sidebar>
      <Routes>
        <Route path="/labirinto" element={<LabirintoPage />} />
      </Routes>
    </div>
  )
}

export default App
