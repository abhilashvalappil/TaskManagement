
import { Routes, Route } from 'react-router-dom'
import './App.css'
import './index.css'
import UserRoutes from './routes/userRoutes'
 

const App: React.FC = () => {

  return (
    <Routes>
        {UserRoutes()}
    </Routes>
  )
}

export default App
