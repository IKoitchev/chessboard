import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./App.css";
import PlayPage from "./components/PlayPage";

function App() {
  return (
    <>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlayPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
