

import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'

function App() {


  return (
    <Router>
      <Route path="/" element={<div>Home</div>} />
    </Router>
  )
}

export default App
