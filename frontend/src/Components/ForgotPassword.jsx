import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Important: Check response status explicitly
      if (response.status === 200) {
        const data = await response.json();
        setMessage(t('forgot_password.reset_link_sent'));
      } else {
        // Handle different status codes
        const errorData = await response.json();
        setError(errorData.error || t('forgot_password.error_occurred'));
      }
    } catch (error) {
      setError(t('forgot_password.error_occurred'));
      console.error('Forgot password error:', error);
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h3>{t('forgot_password.title')}</h3>
        <form onSubmit={handleForgotPassword} className="form-group">
          <label htmlFor="email">{t('forgot_password.email')}</label>
          <input
            type="email"
            className="form-control"
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <button type="submit" className="btn btn-success btn-md">
            {t('forgot_password.send_reset_link')}
          </button>
        </form>

        {message && (
          <div className="success-msg" style={{ color: 'green' }}>
            {message}
          </div>
        )}
        {error && (
          <div className="error-msg" style={{ color: 'red' }}>
            {error}
          </div>
        )}

        <span>
          {t('forgot_password.remember_password')}
          <Link to="/login"> {t('forgot_password.back_to_login')}</Link>
        </span>
      </div>
    </div>
  );
};

export default ForgotPassword;