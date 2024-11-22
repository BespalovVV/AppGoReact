import React, { useEffect, useState } from 'react';
import './styles/App.css'
import { BrowserRouter } from "react-router-dom";
import MyNavBar from './components/UI/navBar/MyNavBar';
import AppRouter from './components/AppRouter';
import { AuthContext, DataProvider } from './context';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('auth')){
      setIsAuth(true)
    }
  }, [])
  return (
    <AuthContext.Provider value={{
      isAuth,
      setIsAuth
    }}>
      <BrowserRouter>
        <MyNavBar />
        <AppRouter />
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default App;
