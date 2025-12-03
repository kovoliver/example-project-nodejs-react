// src/pages/cars/CarPage.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../App";
import { fetchAPI, handleChange, validateForm } from "../../app/functions";
import { fileBaseUrl, sBaseUrl } from "../../app/url";
import { carSchema } from "../../app/schemas";
import ImagesComponent from "../../components/ImagesComponent";

export default function CarPage() {
    const { carID } = useParams();
    const navigate = useNavigate();
    const gc = useContext(GlobalContext);

    const [formData, setFormData] = useState({
        title: "",
        make: "",
        model: "",
        description: ""
    });

    const [errors, setErrors] = useState({
        title: "",
        make: "",
        model: "",
        description: ""
    });

    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadCar = async () => {
        setLoading(true);

        try {
            const res = await fetchAPI(`${sBaseUrl}/car/get/${carID}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${gc.token}`
                },
                credentials: "include"
            });

            setFormData({
                title: res.data.title || "",
                make: res.data.make || "",
                model: res.data.model || "",
                description: res.data.description || ""
            });

            setMainImage(res.data.mainImage || null);
        } catch (err) {
            gc.setMessages(err.message || "Error loading car!", "error");
        } finally {
            setLoading(false);
        }
    };

    // --- AUTO BETÖLTÉSE UPDATE MÓDBAN ---
    useEffect(() => {
        if (!carID) return;

        loadCar();
    }, [carID]);

    // --- AUTÓ MENTÉSE ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // validate
        const v = validateForm(formData, carSchema);
        if (!v.passed) {
            setErrors(v.messages);
            return;
        }

        const url = carID ? `${sBaseUrl}/car/update/${carID}` : `${sBaseUrl}/car/create`;
        const method = carID ? "PATCH" : "POST";

        try {
            const res = await fetchAPI(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${gc.token}`
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });

            gc.setMessages(res.message, "success");

            if (!carID) {
                navigate(`/user/car/${res.insertID}`);
            }
        } catch (err) {
            gc.setMessages(err.message || "Error saving car!", "error");
        }
    };

    // --- KÉP KIVÁLASZTÁSA ---
    const handleImageChange = (e) => {
        setMainImage(e.target.files[0]);
    };

    // --- KÉP FELTÖLTÉS ---
    

    // --- RENDER ---
    return (
        <div>
            <ImagesComponent
                carID={carID}
            />

            <div className="maxw-600 margin-auto px-md py-md box-light radius-md shadow-md">
                <h1 className="mb-lg">{carID ? "Update Car" : "Add New Car"}</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {/* TITLE */}
                        <div className="mb-sm">
                            <h4>Title</h4>
                            <label className="text-error p-sm d-block">{errors.title}</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={(e) =>
                                    handleChange(e, setFormData, setErrors, carSchema)
                                }
                                className="input-md input-primary wp-100"
                            />
                        </div>

                        {/* MAKE */}
                        <div className="mb-sm">
                            <h4>Make</h4>
                            <label className="text-error p-sm d-block">{errors.make}</label>
                            <input
                                type="text"
                                name="make"
                                value={formData.make}
                                onChange={(e) =>
                                    handleChange(e, setFormData, setErrors, carSchema)
                                }
                                className="input-md input-primary wp-100"
                                required
                            />
                        </div>

                        {/* MODEL */}
                        <div className="mb-sm">
                            <h4>Model</h4>
                            <label className="text-error p-sm d-block">{errors.model}</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={(e) =>
                                    handleChange(e, setFormData, setErrors, carSchema)
                                }
                                className="input-md input-primary wp-100"
                                required
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mb-sm">
                            <h4>Description</h4>
                            <label className="text-error p-sm d-block">{errors.description}</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={(e) =>
                                    handleChange(e, setFormData, setErrors, carSchema)
                                }
                                className="input-md input-primary wp-100"
                                rows={4}
                            />
                        </div>

                        {/* MAIN IMAGE */}
                        <div className="mb-sm">
                            {mainImage && typeof mainImage === "string" && (
                                <img
                                    src={`${fileBaseUrl}/uploads/${mainImage}`}
                                    alt="Car"
                                    className="wp-100 mt-sm radius-sm"
                                    style={{ height: "200px", objectFit: "cover" }}
                                />
                            )}
                        </div>

                        <button className="btn-secondary input-md mt-md">
                            {carID ? "Update Car" : "Add Car"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}