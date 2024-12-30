import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Navbar from "./components/Navbar";
import MainPage from "./components/MainPage";
import CarsGallery from "./components/CarsGallery";
import Footer from "./components/Footer";
import axios from "axios";
import BuyPage from "./components/BuyPage";
import CarDetailsPage from "./components/CarDetailsPage";
import ProfilePage from "./components/ProfilePage";


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
    const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);

    const handleLogin = async ({email, password}) => {
        try {
            const response = await axios.post("http://localhost:8080/auth/signin", { email, password });

            console.log("Login successful:", response.data);
            localStorage.setItem("token", response.data.jwt);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
        }
    };

    const sendGeneratedPassword = async ({email}) => {
        try {
            await axios.post(`http://localhost:8080/api/getgeneratedpass:${email}`)
        } catch (error) {
            console.error(error.message);
        }
    }

    const toggleSidePanel = () => {
        setIsSidePanelVisible((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false); // Trigger re-render
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    return (
        <div
            className="App"
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", // Ensure the container takes up full height of the viewport
            }}
        >
            <Router>
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    {isAuthenticated ? (
                        <div style={{ display: "flex", height: "100%" }}>
                            <div
                                style={{
                                    flex: 1,
                                    marginLeft: isSidePanelVisible ? "50px" : "50px",
                                    transition: "margin-left 1s ease",
                                }}
                            >
                                <Routes>
                                    <Route path="/main" element={<MainPage />} />
                                    <Route path="/cars" element={<CarsGallery />} />
                                    <Route path="/car-details/:id" element={<CarDetailsPage/>}/>
                                    <Route path="/profile" element={<ProfilePage isAuthenticated={isAuthenticated}  />} />
                                    <Route path="/buy/:id" element={<BuyPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} loginFunc={handleLogin} oneTimePass={sendGeneratedPassword} />}/>
                                    <Route path="*" element={<MainPage />} />
                                </Routes>
                            </div>
                        </div>
                    ) : (
                        <Routes>
                            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} loginFunc={handleLogin} oneTimePass={sendGeneratedPassword}/>} />
                            <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
                            <Route path="/main" element={<MainPage />} />
                            <Route path="/cars" element={<CarsGallery />} />
                            <Route path="/car-details/:id" element={<CarDetailsPage/>}/>
                            <Route path="/buy/:id" element={<BuyPage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} loginFunc={handleLogin} />}/>
                            <Route path="*" element={<MainPage />} />
                        </Routes>
                    )}
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
