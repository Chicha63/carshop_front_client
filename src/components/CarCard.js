import React from "react";
import "./CarCard.css";

const CarCard = ({ car, isLarge }) => {
    return (
        <div className={`car-card ${isLarge ? "large" : "small"}`}>
            <h3>{car.modelName}</h3>
            <p><strong>Manufacturer:</strong> {car.manufacturer}</p>
            <p><strong>Price:</strong> ${car.price}</p>
            {isLarge && (
                <>
                    <p><strong>Year:</strong> {car.year}</p>
                    <p><strong>Color:</strong> {car.color}</p>
                </>
            )}
        </div>
    );
};

export default CarCard;
