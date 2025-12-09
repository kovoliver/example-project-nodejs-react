import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchAPI } from "../app/functions";
import { GlobalContext } from "../App";
import { sBaseUrl } from "../app/url";

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

            //setCarData();
        } catch(err) {
            gc.setMessages(err.message || "Error getting cars!", "error");
        }
    };

    useEffect(()=> {
        getCarData();
    }, [carID]);

    return(
        <div>

        </div>
    );
};