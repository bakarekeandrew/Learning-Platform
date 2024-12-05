import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Extract token from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    if (!token) {
      setError(t('reset_password.invalid_token'));
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError(t('reset_password.passwords_do_not_match'));
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    try {
      const response = await fetch('http://localhost:8080/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token, 
          newPassword 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(t('reset_password.success'));
        // Redirect to login after a short delay
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.error || t('reset_password.error_occurred'));
      }
    } catch (error) {
      setError(t('reset_password.error_occurred'));
      console.error('Reset password error:', error);
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <h2>{t('reset_password.title')}</h2>
        <form onSubmit={handleResetPassword}>
          <label htmlFor="newPassword">{t('reset_password.new_password')}</label>
          <input
            type="password"
            className="form-control"
            style={{ width: '100%' }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword" className="mt-3">
            {t('reset_password.confirm_password')}
          </label>
          <input
            type="password"
            className="form-control"
            style={{ width: '100%' }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary mt-3">
            {t('reset_password.reset_password')}
          </button>
        </form>

        {message && <div className="text-success mt-3">{message}</div>}
        {error && <div className="text-danger mt-3">{error}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;