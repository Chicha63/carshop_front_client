import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CarsGallery.css";

const CarsGallery = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cars = location.state?.filteredCars || []; // Retrieve filtered cars from state

    useEffect(() => {
        if (!location.state?.filteredCars) {
            // If no data is passed, redirect back to MainPage
            navigate("/");
        }
        console.log(location.state?.filteredCars);
    }, [location.state, navigate]);

    const handleBuy = (carId) => {
        // Handle the buy button click
        console.log(`Buy button clicked for car with ID: ${carId}`);
        navigate(`/buy/${carId}`);
    };

    const handleDetails = (carId) => {
        // Handle the details button click
        console.log(`Details button clicked for car with ID: ${carId}`);
        // Navigate to a details page
        navigate(`/car-details/${carId}`);
    };

    return (
        <div className="cars-gallery">
            {cars.map((car) => (
                <div className="car-card" key={car.id}>
                    <div className="car-image">
                        <img
                            src={`http://localhost:8081/img/${car.id}.jpg`}
                            alt={car.model.modelName.name}
                            style={{ width: "100%", height: "150px", objectFit: "cover" }}
                            onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                            }}
                        />
                    </div>
                    <h3 className="car-title">{car.model.modelName.name}</h3>
                    <p><strong>Manufacturer:</strong> {car.model.modelName.manufacturer.name}</p>
                    <p><strong>Year:</strong> {car.model.year}</p>
                    <p><strong>Body Type:</strong> {car.model.characteristics.bodyType.name}</p>
                    <p><strong>Doors:</strong> {car.model.characteristics.doorsCount}</p>
                    <p><strong>Seats:</strong> {car.model.characteristics.placesCount}</p>
                    <p>
                        <strong>Engine:</strong> {car.model.characteristics.engine.name} ({car.model.characteristics.engine.volume}L)
                    </p>
                    <p><strong>Color:</strong> {car.color.name}</p>
                    <p><strong>Price:</strong> ${car.price.toLocaleString()}</p>
                    <div className="button-container">
                        <button
                            className="buy-button1"
                            onClick={() => handleBuy(car.id)}
                        >
                            Buy
                        </button>
                        <button
                            className="details-button"
                            onClick={() => handleDetails(car.id)}
                        >
                            Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CarsGallery;
