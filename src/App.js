import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./assets/scss/main.css";
import "./App.css";
import "./index.css";
import Login from "./pages/Login";
import ImageCropper from "./pages/ImageCropper";
import Home from "./pages/Home";
import JlHome from "./pages/jlhome";
import ImageUpload from "./pages/ImageUpload";
import JlCertificate from "./pages/JlCertificate";
import MagicMIanCard from "./pages/MagicMIanCard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/imagecropper" element={<ImageCropper />} />
        <Route path="/imageupload" element={<ImageUpload />} />
        <Route path="/home" element={<Home />} />
        <Route path="/jlhome" element={<JlHome />} />
        <Route path="/magiccard" element={<MagicMIanCard />} />
        <Route path="/jlpdf" element={<JlCertificate />} />
      </Routes>
    </Router>
  );
}

export default App;
