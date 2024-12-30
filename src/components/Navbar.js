import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";

const Navbar = ({ isAuthenticated, onLogout }) => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
    });

    const getFilteredGoods = async (filters) => {
        try {
            const response = await axios.get("http://localhost:8080/api/goods", { params: filters });
            return response.data;
        } catch (error) {
            console.error("Error fetching goods:", error);
            throw error;
        }
    };

    const handleLogout = () => {
        if (onLogout) {
            onLogout(); // Call the provided logout handler
        }
        navigate("/main"); // Redirect to login page after logout
    };

    const handleLogin = () => {
        navigate("/login"); // Redirect to login page when not authenticated
    };

    const handleProfile = () => {
        navigate("/profile"); // Redirect to login page when not authenticated
    };

    const handleHome = () => {
        navigate("/main"); // Navigate to main page
    };

    const handleCars = async() => {
        const data = await getFilteredGoods(filters);
        navigate("/cars",{ state: { filteredCars: data} }); // Navigate to cars gallery
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="navbar-logo" onClick={handleHome}>
                    Car Shop
                </div>
            </div>
            <div className="navbar-right">
                {isAuthenticated ? (
                    <>
                        <button className="navbar-button" onClick={handleHome}>Home</button>
                        <button className="navbar-button" onClick={handleProfile}>Profile</button>
                        <button className="navbar-button" onClick={handleCars}>Cars</button>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button className="navbar-button" onClick={handleLogin}>
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
