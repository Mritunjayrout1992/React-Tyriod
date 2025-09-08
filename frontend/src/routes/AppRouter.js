import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../component/login.js";
import ProtectedRoute from "../component/ProtectedRoute.js";
import Dashboard from "../component/dashboard";
import CatalogueView from "../component/CatalogueView.js";
import Catalogue from "../component/Catalogue.js";
import CataloguePreview from "../component/CataloguePreview.js";
import Layout from "../layouts/Layout";

function AppRouter (){
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} /> {/* for / */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="catalogue" element={<CatalogueView />} />
          <Route path="catalogue/create" element={<Catalogue />} />
          <Route path="catalogue/edit/:id" element={<Catalogue />} />
          <Route path="catalogue/preview/:id" element={<CataloguePreview />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default AppRouter;