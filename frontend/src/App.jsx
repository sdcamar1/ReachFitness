import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { About } from "./pages/About";
import { Admin } from "./pages/Admin";
import { Book } from "./pages/Book";
import { Home } from "./pages/Home";
import { InPersonTraining } from "./pages/InPersonTraining";
import { Login } from "./pages/Login";
import { OnlineCoaching } from "./pages/OnlineCoaching";
import { Pricing } from "./pages/Pricing";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  const routes = (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/in-person-training" element={<InPersonTraining />} />
      <Route path="/online-coaching" element={<OnlineCoaching />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/book" element={<Book />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return isAdmin ? routes : <Layout>{routes}</Layout>;
}
