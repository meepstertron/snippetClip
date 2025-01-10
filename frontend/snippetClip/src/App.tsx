

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Feed from './feed'
import TagPage from './tagPage'

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path='/tag/:tag' element={<TagPage />} />
      </Routes>
    </Router>
  )
}

export default App
