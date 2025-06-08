import React from "react";
import { Routes, Route } from "react-router-dom";
import Fornecedores from "../pages/Fornecedores";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/fornecedores" element={<Fornecedores />} />
    </Routes>
  );
};

export default AppRoutes;