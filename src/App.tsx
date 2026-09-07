import { lazy, Suspense } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@shared/utils/ProtectedRoute";
import Navbar from "@shared/components/NavBar";
import { ModalManager } from "@shared/components/Modals";
import Loading from "@shared/components/Loading";
import Home from "./home";

// Lazy-load each route to keep the initial bundle smaller.
const About = lazy(() => import("./About"));
const SignIn = lazy(() => import("./auth/SignIn"));
const ForgotPassword = lazy(() => import("./auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./auth/ResetPassword"));
const RecipeList = lazy(() => import("./recipes/list"));
const RecipeDetail = lazy(() => import("./recipes/detail"));
const RecipeForm = lazy(() => import("./recipes/form"));
const ImportReview = lazy(() => import("./recipes/import-review"));
const CollectionList = lazy(() => import("./collections/list"));
const CollectionDetail = lazy(() => import("./collections/detail"));
const CollectionForm = lazy(() => import("./collections/form"));

const App = () => {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-6">
      <Router>
        <ModalManager>
          <Navbar />
          <div className="container mx-auto px-4">
            <Suspense fallback={<Loading className="mt-40" />}>
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
                <Route path="/recipes" element={<RecipeList />}>
                  <Route path=":id" element={<RecipeDetail />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route
                  path="/add-new"
                  element={
                    <ProtectedRoute>
                      <RecipeForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/import-review"
                  element={
                    <ProtectedRoute>
                      <ImportReview />
                    </ProtectedRoute>
                  }
                />
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
            </Suspense>
          </div>
        </ModalManager>
      </Router>
    </div>
  );
};

export default App;
