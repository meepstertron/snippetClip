

import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import Feed from './feed'

function App() {


  return (
    <Router>
      <Route path="/" element={<Feed />} />
    </Router>
  )
}

export default App
