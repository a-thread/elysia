import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@shared/utils/ProtectedRoute";
import Navbar from "@shared/components/NavBar";
import About from "./About";
import ResetPassword from "./auth/ResetPassword";
import SignIn from "./auth/SignIn";
import Register from "./auth/Register";
import { CollectionList, CollectionDetail, CollectionForm } from "./collections";
import { ModalManager } from "@shared/components/Modals";
import { ForgotPassword } from "./auth";
import { RecipeList, RecipeDetail, RecipeForm } from "./recipes";

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
              <Route path="/" element={<RecipeList />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/add-new"
                element={
                  <ProtectedRoute>
                    <RecipeForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route
                path="/recipes/:id/edit"
                element={
                  <ProtectedRoute>
                    <RecipeForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/collections" element={<CollectionList />} />
              <Route
                path="/collections/add-new"
                element={
                  <ProtectedRoute>
                    <CollectionForm />
                  </ProtectedRoute>
                }
              />
              <Route path="/collections/:id" element={<CollectionDetail />} />
              <Route
                path="/collections/:id/edit"
                element={<CollectionForm />}
              />
            </Routes>
          </div>
        </ModalManager>
      </Router>
    </div>
  );
};

export default App;
