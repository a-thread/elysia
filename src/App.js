import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recipe from "./pages/Recipe";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import Tags from "./pages/Tags";
import { ModalManager } from "./shared/services/modalManager";
import About from "./pages/About";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import SignIn from "./pages/SignIn";
import Register from "./pages/Register";
import RecipeForm from "./pages/RecipeForm";
import Collection from "./pages/Collection";
import CollectionForm from "./pages/CollectionForm";
import Collections from "./pages/Collections";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-6">
      <Router basename="/elysia">
        <ModalManager>
          <Navbar />
          <div className="container mx-auto px-4">
            <Routes>
              <Route
                path="/sign-in"
                element={
                  <ProtectedRoute>
                    <SignIn />
                  </ProtectedRoute>
                }
              />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/tags"
                element={
                  <ProtectedRoute>
                    <Tags />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-new"
                element={
                  <ProtectedRoute>
                    <RecipeForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/recipes/:id" element={<Recipe />} />
              <Route
                path="/recipes/:id/edit"
                element={
                  <ProtectedRoute>
                    <RecipeForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collections"
                element={
                  <ProtectedRoute>
                    <Collections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collections/add-new"
                element={
                  <ProtectedRoute>
                    <CollectionForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/collections/:id" element={<Collection />} />
              <Route
                path="/collections/:id/edit"
                element={
                  <ProtectedRoute>
                    <CollectionForm />
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
