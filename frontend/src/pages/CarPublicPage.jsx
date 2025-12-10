import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPI } from "../app/functions";
import { GlobalContext } from "../App";
import { sBaseUrl } from "../app/url";
import SlideShow from "../components/SlideShow";

export default function CarPublicPage() {
    const {carUrlData} = useParams();
    const [carID, setCarID] = useState(0);
    const [carData, setCarData] = useState(null);
    const gc = useContext(GlobalContext);

    useEffect(()=> {
        const arr = carUrlData.split('-');

        if(arr.length < 3) return;
        const carID = parseInt(arr[2]);
        
        if(isNaN(carID)) return;

        setCarID(carID);
    }, [carUrlData]);

    const getCarData = async ()=> {
        if(!carID) return;

        try {
            const res = await fetchAPI(
                `${sBaseUrl}/car/get-public/${carID}`
            );

            setCarData(res.data);
        } catch(err) {
            gc.setMessages(err.message || "Error getting cars!", "error");
        }
    };

    useEffect(()=> {
        getCarData();
    }, [carID]);

    return(
        <div className="row text-center">
            <div className="col-lg-6 col-md-6 p-sm">
                <div className="box-light">
                    {
                        carData?.images 
                        &&
                        <SlideShow
                            images={carData?.images}
                        />
                    }
                </div>
            </div>
            <div className="col-lg-6 col-md-6 p-sm">
                <div className="box-light">
                    <h3>{carData?.title}</h3>

                    <div className="row border-table">
                        <div className="box-mid p-sm col-xs-6 color-white">
                            {carData?.make}
                        </div>

                        <div className="box-mid p-sm col-xs-6 color-white">
                            {carData?.model}
                        </div>
                    </div>

                    <div className="box-white p-sm">
                        {carData?.description}
                    </div>
                </div>
            </div>
        </div>
    );
};