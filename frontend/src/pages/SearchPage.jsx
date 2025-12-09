import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../App";
import { fetchAPI } from "../app/functions";
import { fileBaseUrl, sBaseUrl } from "../app/url";
import { Link, useNavigate } from "react-router-dom";
import { AutoSuggest } from "../components/AutoSuggest";

export default function SearchPage() {
    const [cars, setCars] = useState([]);
    const [searchParams, setSearchParams] = useState({
        make:"",
        model:"",
        keyWord:""
    });
    const [queryString, setQueryString] = useState("");
    const [makes, setMakes] = useState([]);
    const [models, setModels] = useState([]);
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

    const getMakesAndModels = async ()=> {
        try {
            const response = await fetchAPI(`${sBaseUrl}/car/makes-models`);
            
            setMakes(response.data.makes);
            setModels(response.data.models);
        } catch(err) {
            gc.setMessages(err.message || "Error getting cars!", "error");
        }
    };

    useEffect(()=> {
        getMakesAndModels();
        searchCars();
    }, []);

    useEffect(()=> {
        setQueryString(new URLSearchParams(searchParams).toString());
    }, [searchParams]);

    useEffect(()=> {
        navigate("/search?" + queryString);
    }, [queryString]);

    return(
        <div>
            <div className="box-light p-md my-md row">
                <div className="p-md col-lg-3 col-md-3 text-center">
                    <AutoSuggest
                        values={makes}
                        value={searchParams.make}
                        title="Make"
                        setValue={v=>setSearchParams({...searchParams, make:v})}
                    />
                </div>

                <div className="p-md col-lg-3 col-md-3 text-center">
                    <h4>Model</h4>

                    <input type="text" className="input-md input-primary wp-100"/>
                </div>

                <div className="p-md col-lg-3 col-md-3 text-center">
                    <h4>Keyword</h4>

                    <input type="text" className="input-md input-primary wp-100"/>
                </div>

                <div className="p-md col-lg-3 col-md-3 text-center">
                    <h4>Search</h4>

                    <button onClick={searchCars} className="input-md btn-primary wp-100">
                        Search
                    </button>
                </div>
            </div>

            {cars.length === 0 ? (
                <p>No cars found.</p>
            ) : (
                <div className="row">
                    {cars.map((car) => (
                        <div key={car.carID} className="col-md-4 p-sm">
                            <div className="box-light radius-md shadow-md p-md d-flex fd-column">
                                {car.mainImage ? (
                                    <Link to={`/car/${car.make}-${car.model}-${car.carID}`}>
                                        <img
                                            src={`${fileBaseUrl}/uploads/${car.mainImage}`}
                                            alt={car.title || car.model}
                                            className="wp-100 radius-sm mb-sm"
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                    </Link>
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