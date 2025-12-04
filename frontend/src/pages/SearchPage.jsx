import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../App";
import { fetchAPI } from "../app/functions";
import { fileBaseUrl, sBaseUrl } from "../app/url";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
    const [cars, setCars] = useState([]);
    const [searchParams, setSearchParams] = useState({
        make:"",
        model:"",
        keyWord:""
    });
    const [queryString, setQueryString] = useState("");
    const gc = useContext(GlobalContext);
    const navigate = useNavigate();

    const searchCars = async ()=> {
        try {
            const res = await fetchAPI(
                `${sBaseUrl}/car/search?${queryString}`
            );

            setCars(res.cars);
        } catch(err) {
            gc.setMessages(err.message || "Error getting cars!", "error");
        }
    };

    useEffect(()=> {
        setQueryString(new URLSearchParams(searchParams).toString());
    }, [searchParams]);

    useEffect(()=> {
        searchCars();

        navigate("/search?" + queryString);
    }, [queryString]);

    return(
        <div>
            {cars.length === 0 ? (
                <p>No cars found.</p>
            ) : (
                <div className="row">
                    {cars.map((car) => (
                        <div key={car.carID} className="col-md-4 mb-lg">
                            <div className="box-light radius-md shadow-md p-md d-flex fd-column">
                                {car.mainImage ? (
                                    <img
                                        src={`${fileBaseUrl}/uploads/${car.mainImage}`}
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
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}