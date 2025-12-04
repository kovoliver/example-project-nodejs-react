import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../App";
import { fetchAPI } from "../app/functions";
import { fileBaseUrl, sBaseUrl } from "../app/url";

export default function ImagesComponent({ carID }) {
    const [images, setImages] = useState([]);
    const gc = useContext(GlobalContext);

    const getImages = async () => {
        if (!carID) return;

        try {
            const response = await fetchAPI(`${sBaseUrl}/car_images/${carID}`, {
                headers: { "authorization": `Bearer ${gc.token}` },
                credentials: "include"
            });

            setImages(response.images);
        } catch (err) {
            gc.setMessages(err.message || "Error loading car!", "error");
        }
    };

    const handleImageUpload = async (e) => {
        if (!carID) return;

        const form = new FormData();
        for (const file of e.target.files) {
            form.append("car_images", file);
        }

        try {
            const res = await fetchAPI(`${sBaseUrl}/car_images/upload/${carID}`, {
                method: "POST",
                headers: {
                    "authorization": `Bearer ${gc.token}`
                },
                credentials: "include",
                body: form
            });

            gc.setMessages(res.message, "success");

            setImages([...images, ...res.images]);
            e.target.value = "";
        } catch (err) {
            gc.setMessages(err.message || "Error uploading image!", "error");
        }
    };

    const updateMainImg = async (imageID) => {
        if (!carID) return;

        try {
            const res = await fetchAPI(`${sBaseUrl}/car_images/set-main/${imageID}/${carID}`, {
                method: "PATCH",
                headers: {
                    "authorization": `Bearer ${gc.token}`
                },
                credentials: "include"
            });

            gc.setMessages(res.message, "success");

            setImages(prev => prev.map(img => ({
                ...img,
                isMain: img.imageID === imageID
            })).sort((a, b) => b.isMain - a.isMain)); // a fő kép kerüljön előre
        } catch (err) {
            gc.setMessages(err.message || "Error uploading image!", "error");
        }
    };

    const deleteImage = async (imageID) => {
        if (!carID) return;

        if (!window.confirm("Are you sure you want to delete this image?")) return;

        try {
            const res = await fetchAPI(`${sBaseUrl}/car_images/delete/${imageID}`, {
                method: "DELETE",
                headers: {
                    "authorization": `Bearer ${gc.token}`
                },
                credentials: "include"
            });

            gc.setMessages(res.message, "success");

            // Memóriából is töröljük
            setImages(prev => prev.filter(img => img.imageID !== imageID));
        } catch (err) {
            gc.setMessages(err.message || "Error deleting image!", "error");
        }
    };

    useEffect(() => {
        getImages();
    }, []);

    return (
        <div className="box-light p-md mb-xl">
            <div className="mb-md">
                <input type="file" onChange={handleImageUpload} multiple />
            </div>

            <div className="row">
                {
                    images.map(img =>
                        <div className="col-lg-3 col-md-3 col-sm-6 p-sm p">
                            <div className={"radius-md h-200 p-relative mb-sm overflow-hidden "
                                + (img.isMain ? 'border-secondary-3' : 'border-dark-3')}>
                                <img
                                    src={`${fileBaseUrl}/uploads/${img.path}`}
                                    className="radius-sm mb-sm"
                                    style={{ height: "200px", width: "100%", objectFit: "cover" }}
                                />
                            </div>

                            <div className="d-flex jc-space-evenly">
                                <button onClick={() => deleteImage(img.imageID)}
                                    className="input-sm btn-error text-white">
                                    Delete
                                </button>

                                <button onClick={() => updateMainImg(img.imageID)}
                                    className="input-sm btn-success">
                                    Main
                                </button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}