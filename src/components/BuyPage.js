import React, { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router-dom";
import "./BuyPage.css";

const BuyPage = ({isAuthenticated, setIsAuthenticated, loginFunc, oneTimePass}) => {
    const {id} = useParams();
    const [good, setGood] = useState(null); // Represents the good being bought
    const [paymentMethod, setPaymentMethod] = useState();
    const [delivery, setDelivery] = useState(false);
    const [totalSum, setTotalSum] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            // Validate inputs
            if (!email || !password) {
                setError("Please enter both email and password.");
                return;
            }
            loginFunc({ email, password });
        } catch (error) {
            // Handle login errors
            console.error("Login failed:", error.response ? error.response.data : error.message);
            setError("Invalid email or password. Please try again.");
        }
    };

    
    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const paymentRes = await axios.get(
                    "http://localhost:8080/api/paymentmethods",
                )
                const goodRes = await axios.get(
                    `http://localhost:8081/api/good:${id}`,
                )
                setGood(goodRes.data);
                setPaymentMethods(paymentRes.data);
            } catch (e) {
                console.error("Fetch failed:", e.response ? e.response.data : e.message);
            }
        }
        fetchDeal();
    },[])



    const handleCheckout = () => {
        // Handle checkout logic
        if (!paymentMethod) {
            alert("Please select a payment method.");
            return;
        }

        const token = localStorage.getItem("token");
        axios
            .post(
                `http://localhost:8080/api/authed/buy:${id}`,
                {
                    goodId: good.id,
                    payment:paymentMethod,
                    delivery:delivery,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(() => {
                alert("Checkout successful!");
                navigate("/profile"); // Redirect to orders page
            })
            .catch((error) => {
                console.error("Checkout failed:", error);
                alert("Failed to complete checkout. Please try again.");
            });
    };

    const handleDetails = () =>
    {
        navigate(`/car-details/${id}`);
    }

    const handleOneTimePass = async () => {
        try{
            if (!email) {
                setError("Please enter email");
                return;
            }
            oneTimePass({ email });
            setError("Password sent to given email!");
        } catch (e){
            console.error(e.message);

        }
    }

    if (!isAuthenticated) {
        return (
            <div className="login-container">
                <div className="login-box">
                    <h2>Login</h2>
                    <div className="login-field">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-field">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>} {/* Render error message */}
                    <button className="login-button" onClick={handleLogin}>
                        Sign In
                    </button>
                    <div className="signup-prompt">
                        <p>Don't have an account? <span className="signup-link" onClick={() => navigate("/signup")}>Sign Up</span>
                        </p>
                    </div>
                    <div className="signup-prompt">
                        <p>Forgot password? <span className="signup-link"
                                                  onClick={handleOneTimePass}>Send generated password</span></p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="checkout-box">
                <h2>Checkout</h2>
                {good && (
                    <div className="order-summary" onClick={handleDetails}>
                        <div className="car-image">
                            <img
                                src={`http://localhost:8081/img/${good.id}.jpg`}
                                alt={good.model.modelName.name}
                                style={{width: "100%", height: "150px", objectFit: "cover"}}
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                            />
                        </div>
                        <p><strong>Good:</strong> {good.model.modelName.manufacturer.name + " "
                            + good.model.modelName.name + " "
                            + good.model.year} </p>
                        <p><strong>Color:</strong> {good.color.name}</p>
                        <p><strong>Total:</strong> ${good.price.toFixed(2)}</p>
                    </div>
                )}
                <div className="checkout-field">
                    <label htmlFor="paymentMethod">Payment Method:</label>
                    <select
                        id="paymentMethod"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="">Select payment method</option>
                        {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                                {method.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="checkout-field">
                    <label>
                        Add Delivery</label>
                        <input
                            type="checkbox"
                            checked={delivery}
                            onChange={(e) => setDelivery(e.target.checked)}
                        />


                </div>
                <button className="checkout-button" onClick={handleCheckout}>
                    Complete Purchase
                </button>
            </div>
        </div>
    );
};

export default BuyPage;
