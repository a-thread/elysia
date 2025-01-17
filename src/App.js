import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AddRecipe from './pages/AddRecipe';
import Recipe from './pages/Recipe';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/NavBar';
import Favorites from './pages/Favorites';
import EditRecipe from './pages/EditRecipe';
import { ModalManager } from './shared/services/modalManager';
import { ToastProvider } from './shared/services/toastManager';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Router basename="/elysia">
        <ToastProvider>
          <ModalManager>
            <Navbar />
            <div className="container mx-auto px-4 py-6">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
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
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </ModalManager>
        </ToastProvider>
      </Router>
    </div>
  );
}

export default App;