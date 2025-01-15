import { useState } from 'react';
import config from '@/config';

const useToken = () => {
    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = tokenString ? JSON.parse(tokenString) : null;
        return userToken;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: string) => {
        localStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
    };

    const removeToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return {
        setToken: saveToken,
        token,
        removeToken,
    };
};

export const authenticate = (username: string, password: string) => {
    return fetch(`${config.apiUrl}/auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
        .then((data) => data.json())
        .then((data) => {
            localStorage.setItem('token', JSON.stringify(data.token));
            return data;
        });
};

export const fetchUser = () => { 
    if (!localStorage.getItem('token')) {
        return Promise.resolve(null);
    }

    return fetch(`${config.apiUrl}/api/userinfo`, {
        headers: {
            Authorization: `${localStorage.getItem('token')}`,
        },
    })
        .then((data) => data.json())
        .then((data) => {
            if (data.error) {
                localStorage.removeItem('token');
                return null;
            }
            return data;
        });
};

export async function register(email: string, username: string, password: string) {
  try {
    const response = await fetch(`${config.apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await response.json();
    
    if (!response.ok) {
      return { error: data.message || 'Registration failed' };
    }
    
    return data;
  } catch (error) {
    return { error: 'Failed to connect to the server' };
  }
}

export default useToken;