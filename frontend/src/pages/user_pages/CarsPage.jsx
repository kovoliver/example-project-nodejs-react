import { useEffect, useState, useContext } from "react";
import { fetchAPI } from "../../app/functions";
import { fileBaseUrl, sBaseUrl } from "../../app/url";
import { GlobalContext } from "../../App";
import { Link, useNavigate } from "react-router-dom";

export default function CarsPage() {
    const [cars, setCars] = useState([]);
    const gc = useContext(GlobalContext);
    const navigate = useNavigate();

    // Autók lekérése
    const getCars = async () => {
        try {
            const response = await fetchAPI(`${sBaseUrl}/car/user`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${gc.token}`,
                },
            });

            setCars(response.data || []);
        } catch (err) {
            gc.setMessages(err.message || "Error fetching cars", "error");
        }
    };

    useEffect(() => {
        getCars();
    }, []);

    // Autó törlése
    const deleteCar = async (carID) => {
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        try {
            const response = await fetchAPI(`${sBaseUrl}/car/delete/${carID}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${gc.token}`,
                },
            });
            gc.setMessages(response.message, "success");
            getCars(); // frissítjük a listát
        } catch (err) {
            gc.setMessages(err.message || "Error deleting car", "error");
        }
    };

    return (
        <div className="maxw-1200 margin-auto px-md py-md">
            <h1 className="mb-lg">My Cars</h1>

            <div className="mb-xl">
                <Link to="/user/car">
                    <button className="input-md btn-primary">Create car</button>
                </Link>
            </div>

            {cars.length === 0 ? (
                <p>No cars found.</p>
            ) : (
                <div className="row">
                    {cars.map((car) => (
                        <div key={car.carID} className="col-md-4 mb-lg">
                            <div className="box-light radius-md shadow-md p-md d-flex fd-column">
                                {car.mainImage ? (
                                    <img
                                        src={`${fileBaseUrl}/${car.mainImage}`}
                                        alt={car.title || car.model}
                                        className="wp-100 radius-sm mb-sm"
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div className="wp-100 radius-sm bg-mid mb-sm" style={{ height: "200px" }}>
                                        <p className="text-center py-lg">No Image</p>
                                    </div>
                                )}

                                <h4 className="mb-xs">{car.title || car.make}</h4>
                                <p className="mb-sm">{car.make} {car.model}</p>

                                <div className="d-flex jc-space-between">
                                    <button
                                        className="btn-primary input-sm"
                                        onClick={() => navigate(`/user/car/${car.carID}`)}
                                    >
                                        Open
                                    </button>
                                    <button
                                        className="btn-error input-sm"
                                        onClick={() => deleteCar(car.carID)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}