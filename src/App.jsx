import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "@/router/index";
import "@/styles/common.css";

const AppRoutes = () => {
  return useRoutes(routes);
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
