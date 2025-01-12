

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import Feed from './feed'
import TagPage from './tagPage'
import Page from './Login'
import { RootLayout } from './components/RootLayout'
import { useState, useEffect } from 'react'
import { fetchUser } from '@/hooks/useToken'
import CreateSnippet from './createSnippet'
import UserPage from './User'

function App() {

  interface User {
    username: string;
    avatarUrl: string;
  }
  
  const [user, setUser] = useState<User | null>(null);
  
  const handleLogin = () => {
    // Implement login logic
    location.href = '/login';
  };

  const handleLogout = () => {
    // Implement logout logic
    setUser(null);
    localStorage.removeItem('token');
    
  };

  const handleCreateNew = () => {
    // Implement create new logic
    location.href = '/create';
  }

  useEffect(() => {
    const fetchData = async () => {
      // Perform actions after the component has rendered
      setUser(await fetchUser());
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once after the initial render
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
          <Route path='/u/:user' element={<UserPage />} />
          <Route path='/register' element={<Page />} />
          <Route path='/login' element={<Page />} />
          <Route path="/create" element={<CreateSnippet />} />
          <Route path='/forgot-password' element={<div className='text-3xl w-full text-center mt-8'>Heard you forgot your password huh? <p className='mt-5 text-xl'>too bad, i dont have a email server attached. email me at jan.koch@hexagonical.ch or message me on the HC slack</p></div>} />
          <Route path='*' element={<div className='text-9xl overflow-hidden whitespace-nowrap'><span>404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 404 </span></div>} />
        </Routes>
      </RootLayout>
    </Router>
  )
}

export default App
