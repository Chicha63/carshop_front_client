import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FilterCard from "./FilterCard";
import Footer from "./Footer";
import "./MainPage.css";
import axios from "axios";

const MainPage = () => {
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);

    const getFilteredGoods = async (filters) => {
        try {
            const response = await axios.get("http://localhost:8080/api/goods", { params: filters });
            return response.data;
        } catch (error) {
            console.error("Error fetching goods:", error);
            throw error;
        }
    };

    const handleFilterSubmit = async (filters) => {
        try {
            const data = await getFilteredGoods(filters);
            setCars(data); // Use the actual data from the response

            // Redirect to the Cars Gallery page with filtered cars
            navigate("/cars", { state: { filteredCars: data } });
        } catch (error) {
            console.error("Error fetching cars:", error);
        }
    };

    return (
        <div className="main-page">
            <div className="main-content">
                <div className="filter-section">
                    <FilterCard onApplyFilters={handleFilterSubmit} />
                </div>
            </div>
        </div>
    );
};

export default MainPage;
