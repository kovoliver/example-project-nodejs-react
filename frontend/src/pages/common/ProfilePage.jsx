import { useContext, useEffect } from "react";
import { fetchAPI } from "../../app/functions";
import { sBaseUrl } from "../../app/url";
import { GlobalContext } from "../../App";

export default function ProfilePage() {
    const gc = useContext(GlobalContext);

    const getProfile = async () => {
        try {
            const response = await fetchAPI(`${sBaseUrl}/profile/get`, {
                headers:{"authorization":`Bearer ${gc.token}`},
                credentials:"include"
            });

            console.log(response.data);
            
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getProfile();
    }, []);

    return (
        <div>
            <h1>Profile</h1>
            <div className="row text-center">
                <div className="col-lg-6 col-md-6 p-sm">
                    <div className="box-light p-md row">
                        <div className="col-lg-2 p-sm">
                            <h4>Title</h4>
                            <select className="input-md input-primary wp-100">
                                <option value={null}>-</option>
                                <option value="MR">MR</option>
                                <option value="MS">MS</option>
                                <option value="MRS">MRS</option>
                                <option value="DR">DR</option>
                            </select>
                        </div>

                        <div className="col-lg-5 p-sm">
                            <h4>First name</h4>
                            <input className="input-md input-primary wp-100"/>
                        </div>

                        <div className="col-lg-5 p-sm">
                            <h4>Last name</h4>
                            <input className="input-md input-primary wp-100"/>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6 col-md-6 p-sm">
                    <div className="box-light p-md">

                    </div>
                </div>
            </div>
        </div>
    );
}