import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@shared/utils/ProtectedRoute";
import Navbar from "@shared/components/NavBar";
import About from "./About";
import ResetPassword from "./auth/ResetPassword";
import SignIn from "./auth/SignIn";
import { CollectionList, CollectionDetail, CollectionForm } from "./collections";
import { ModalManager } from "@shared/components/Modals";
import { ForgotPassword } from "./auth";
import { RecipeList, RecipeDetail, RecipeForm } from "./recipes";
import ProfilePage from "./profile";
import Home from "./home";

const App = () => {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-6">
      <Router>
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
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
              <Route path="/__debug-collection-form" element={<CollectionForm />} />
              <Route path="/__debug-profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </ModalManager>
      </Router>
    </div>
  );
};

export default App;
