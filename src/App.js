import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import Recipe from './pages/Recipe';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';
import Favorites from './pages/Favorites';
import EditRecipe from './pages/EditRecipe';
import { ModalManager } from './shared/services/modalManager';
import About from './pages/About';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import SignIn from './pages/SignIn';
import Register from './pages/Register';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Router basename="/elysia">
        <ModalManager>
          <Navbar />
          <div className="container mx-auto px-4">
            <Routes>
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/about"
                element={
                  <ProtectedRoute>
                    <About />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-new"
                element={
                  <ProtectedRoute>
                    <AddRecipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipe/:id"
                element={
                  <ProtectedRoute>
                    <Recipe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipe/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditRecipe />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </ModalManager>
      </Router>
    </div>
  );
}

export default App;
