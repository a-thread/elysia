import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import Tags from "./pages/Tags";
import About from "./pages/About";
import ResetPassword from "./modules/auth/ResetPassword";
import SignIn from "./modules/auth/SignIn";
import Register from "./modules/auth/Register";
import CollectionForm from "./modules/collections/CollectionForm";
import Collections from "./modules/collections/Collections";
import { ModalManager } from "@shared/components/Modals";
import { ForgotPassword } from "./modules/auth";
import { Recipe, RecipeForm } from "./modules/recipes";
import { Collection } from "./modules/collections";

const App = () => {
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
};

export default App;