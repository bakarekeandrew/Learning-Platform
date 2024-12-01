import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUserContext();
  const { t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store user information in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userId", data.id);
        localStorage.setItem("userRole", data.role);

        // Set user context
        setUser({
          name: data.username,
          email: data.email,
          id: data.id,
          role: data.role
        });

        // Redirect based on user role
        switch(data.role) {
          case 'ADMIN':
            navigate('/dashboard');
            break;
          case 'USER':
            navigate('/courses');
            break;
          default:
            navigate('/courses');
        }
      } else {
        setError(data.error || t('login.error_login_failed'));
      }
    } catch (error) {
      setError(t('login.error_occurred'));
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      {/* Language Switcher */}
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('fr')}>Français</button>
      </div>

      <h2>{t('login.welcome')}</h2>
      <form onSubmit={login}>
        <div>
          <label>{t('login.email')}</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div>
          <label>{t('login.password')}</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button type="submit">{t('login.login')}</button>
        
        {error && <p>{error}</p>}
        
        <p>
          {t('login.no_account')}{' '}
          <Link to="/register">{t('login.register_here')}</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;