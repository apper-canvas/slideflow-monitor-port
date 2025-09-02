import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SliderPage from "@/components/pages/SliderPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={<SliderPage />} />
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;