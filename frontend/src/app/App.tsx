import React from "react";
import { BrowserRouter } from "react-router-dom";
import SocketInitializer from "@/components/molecules/SocketInitializer";
import { AppRoutes } from "@/routes/AppRoutes";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <SocketInitializer />
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
