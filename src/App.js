// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/UserContext"; // Add this import
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ProductGallery from "./components/ProductGallery";
import ProductDetails from "./components/ProductDetails";
import PillowsGallery from './components/PillowGallery';
import PillowDetails from './components/PillowDetails';
import EpesheetsGallery  from './components/EpesheetsGallery';
import EpesheetsDetails from './components/EpesheetsDetails';
import Login from "./components/Login";
import Register from "./components/Register";
import CompanyInfoPage from "./components/CompanyInfoPage";
import AdminDashboard from "./components/AdminDashboard";
import CompanyAnalytics from "./components/CompanyAnalytics";

function App(){
  return (  
    <UserProvider> {/* Wrap everything with UserProvider */}
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<ProductGallery />} />
            <Route path="/pillow-gallery" element={<PillowsGallery />} />
            <Route path="/epe-sheets" element={<EpesheetsGallery/>} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/pillows/:id" element={<PillowDetails />} />
            <Route path="/epe-sheets/:id" element={<EpesheetsDetails/>} />
            <Route path="/about" element={<CompanyInfoPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analytics" element={<CompanyAnalytics />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}
export default App;