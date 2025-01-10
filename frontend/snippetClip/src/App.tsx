

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Feed from './feed'

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
      </Routes>
    </Router>
  )
}

export default App
