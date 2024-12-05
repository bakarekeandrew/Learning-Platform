import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Components/login';
import Register from './Components/register';
import Course from './Components/course';
import Courses from './Components/Courses';
import Profile from './Components/profile';
import Learnings from './Components/learnings';
import Home from './Components/Home';
import AddCourse from './Components/AddCourse';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Components/DashBoard/Dashboard';
import 'boxicons/css/boxicons.min.css';
import EditCourse from './Components/EditCourses';
import DUsers from './Components/DashBoard/DUsers';
import DCourses from './Components/DashBoard/DCourses';
import Assessment from './Components/Assessment';
import ErrorPage from './Components/ErrorPage';
import AddQuestions from './Components/AddQuestions';
import Performance from './Components/DashBoard/Performance';
import DTutors from './Components/DashBoard/DTutors';
import Certificate from './Components/certificate';
import Forum from './Components/forum';
import { I18nextProvider } from 'react-i18next';
import './i18n';
import ForgotPassword from './Components/ForgotPassword';


// Create a ProtectedRoute component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and doesn't match, redirect
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Unauthorized component
const Unauthorized = () => {
  return (
    <div className="unauthorized">
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <button onClick={() => window.location.href = '/'}>Go to Home</button>
    </div>
  );
};

function App() {
  return (
  <div className="App">
    <I18nextProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          {/* User Protected Routes */}
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute requiredRole="USER">
                <Courses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/course/:id" 
            element={
              <ProtectedRoute requiredRole="USER">
                <Course />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/discussion/:id" 
            element={
              <ProtectedRoute requiredRole="USER">
                <Forum />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/certificate/:id" 
            element={
              <ProtectedRoute requiredRole="USER">
                <Certificate />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assessment/:id" 
            element={
              <ProtectedRoute requiredRole="USER">
                <Assessment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute requiredRole="USER">
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Learnings" 
            element={
              <ProtectedRoute requiredRole="USER">
                <Learnings />
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addcourse" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AddCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/editCourse/:id" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <EditCourse />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addquestions/:id" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AddQuestions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Dcourses" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DCourses />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Dusers" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Dtutors" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DTutors />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/Performance" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Performance />
              </ProtectedRoute>
            } 
          />

          {/* Catch-all route */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </I18nextProvider>
           
    </div>
  );
}

export default App;