

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Feed from './feed'
import TagPage from './tagPage'
import Page from './Login'
import { RootLayout } from './components/RootLayout'
import { useState } from 'react'

function App() {

  interface User {
    username: string;
    avatarUrl: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const handleLogin = () => {
    // Implement login logic
    setUser({ username: "JohnDoe", avatarUrl: "/path/to/avatar.jpg" });
  };

  const handleLogout = () => {
    // Implement logout logic
    setUser(null);
  };

  const handleCreateNew = () => {
    // Implement create new logic
    console.log("Create new clicked");
  }
  return (
    <Router>
      <RootLayout
      username={user?.username}
      avatarUrl={user?.avatarUrl}
      onLogin={handleLogin}
      onLogout={handleLogout}
      onCreateNew={handleCreateNew}
    >
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path='/tag/:tag' element={<TagPage />} />
          <Route path='/login' element={<Page />} />
          <Route path='*' element={<div className='text-9xl overflow-hidden whitespace-nowrap'><span>404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 </span></div>} />
        </Routes>
      </RootLayout>
    </Router>
  )
}

export default App
