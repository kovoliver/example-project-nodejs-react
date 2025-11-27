import { useContext, useEffect, useState } from "react";
import { fetchAPI, handleChange as handleFieldChange, setSingleInput, validateField, validateForm } from "../../app/functions";
import { sBaseUrl } from "../../app/url";
import { GlobalContext } from "../../App";
import NumberInput from "../../components/NumberInput";
import { emailSchema, newPassSchema, profileSchema } from "../../app/schemas";

export default function ProfilePage() {
    const gc = useContext(GlobalContext);
    const [profileData, setProfileData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        zip: "",
        settlement: "",
        streetType: "",
        street: "",
        houseNumber: "1",
        floorNumber: "0",
        doorNumber: "0"
    });

    const [profileErrors, setProfileErrors] = useState({});
    const [newPassData, setNewPassData] = useState({
        pass:"",
        newPass:"",
        newPassAgain:""
    });
    const [newPassErrors, setNewPassErrors] = useState({});
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(null);
    const [pass, setPass] = useState("");

    const getProfile = async () => {
        try {
            const response = await fetchAPI(`${sBaseUrl}/profile/get`, {
                headers: { "authorization": `Bearer ${gc.token}` },
                credentials: "include"
            });

            const email = response.data.email;
            setEmail(email);
            const pd = response.data;
            delete pd.email;

            setProfileData(pd);
        } catch (err) {
            gc.setMessages(err.message || ["Error during registration!"], "error");
        }
    };

    const handleNumberChange = (name, value) => {
        setProfileData(prev => ({ ...prev, [name]: String(value) }));
        const errMsg = profileSchema.extract(name).validate(String(value)).error?.details[0]?.message || null;
        setProfileErrors(prev => ({ ...prev, [name]: errMsg }));
    };

    const handleSave = async () => {
        const { passed, messages } = validateForm(profileData, profileSchema);
        setProfileErrors(messages);

        if (!passed) return;

        try {
            const response = await fetchAPI(`${sBaseUrl}/profile/update`, {
                method: "PATCH",
                headers: {
                    "authorization": `Bearer ${gc.token}`,
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(profileData)
            });

            gc.setMessages(response.message || "Profile updated successfully!", "success");
        } catch (err) {
            console.log(err);
            gc.setMessages(err.message || "Error during registration!", "error");
        }
    };

    const handleSavePass = async ()=> {
        const { passed, messages } = validateForm(newPassData, newPassSchema);
        setNewPassErrors(messages);

        if (!passed) return;

         try {
            const response = await fetchAPI(`${sBaseUrl}/profile/update-pass`, {
                method: "PATCH",
                headers: {
                    "authorization": `Bearer ${gc.token}`,
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(newPassData)
            });

            setNewPassData({
                pass:"",
                newPass:"",
                newPassAgain:""
            });

            gc.setMessages(response.message || "Password updated successfully!", "success");
        } catch (err) {
            console.log(err);
            gc.setMessages(err.message || "Error during updating password!", "error");
        }
    };

    const updatePass = async ()=> {
         try {
            const response = await fetchAPI(`${sBaseUrl}/profile/update-email`, {
                method: "PATCH",
                headers: {
                    "authorization": `Bearer ${gc.token}`,
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({email, pass})
            });

            setPass("");

            gc.setMessages(response.message || "Password updated successfully!", "success");
        } catch (err) {
            console.log(err);
            gc.setMessages(err.message || "Error during updating password!", "error");
        }
    };

    const uploadProfileImage = async (input)=> {
        const files = input.files;

        const fd = new FormData();

        for(const file of files) {
            fd.append("profileImage", file);
        }

        console.log(fd.getAll("profileImage"));

        const response = await fetchAPI(`${sBaseUrl}/profile/profile-image`, {
            method:"POST",
            body:fd
        });

        console.log(response);
        input.value = "";
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

                        {/* Title */}
                        <div className="col-lg-2 p-sm">
                            <div className="mb-xs"><b>Title</b></div>
                            {profileErrors.title && <div className="error">{profileErrors.title}</div>}

                            <select
                                name="title"
                                className="input-md input-primary wp-100"
                                value={profileData.title}
                                onChange={e => handleFieldChange(e, setProfileData, setProfileErrors, profileSchema)}
                            >
                                <option value="">-</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>

                        {/* First Name */}
                        <div className="col-lg-5 p-sm">
                            <div className="mb-xs"><b>First name</b></div>
                            {profileErrors.firstName && <div className="error">{profileErrors.firstName}</div>}
                            <input
                                name="firstName"
                                className="input-md input-primary wp-100"
                                value={profileData.firstName}
                                onChange={e => handleFieldChange(e, setProfileData, setProfileErrors, profileSchema)}
                            />
                        </div>

                        {/* Last Name */}
                        <div className="col-lg-5 p-sm">
                            <div className="mb-xs"><b>Last name</b></div>
                            {profileErrors.lastName && <div className="error">{profileErrors.lastName}</div>}
                            <input
                                name="lastName"
                                className="input-md input-primary wp-100"
                                value={profileData.lastName}
                                onChange={e => handleFieldChange(e, setProfileData, setProfileErrors, profileSchema)}
                            />
                        </div>

                        {/* Zip */}
                        <div className="col-lg-2 p-sm">
                            <div className="mb-xs"><b>Zip</b></div>
                            {profileErrors.zip && <div className="error">{profileErrors.zip}</div>}
                            <input
                                name="zip"
                                className="input-md input-primary wp-100"
                                value={profileData.zip}
                                onChange={e => handleFieldChange(e, setProfileData, setProfileErrors, profileSchema)}
                            />
                        </div>

                        {/* Settlement */}
                        <div className="col-lg-4 p-sm">
                            <div className="mb-xs"><b>Settlement</b></div>
                            {profileErrors.settlement && <div className="error">{profileErrors.settlement}</div>}
                            <input
                                name="settlement"
                                className="input-md input-primary wp-100"
                                value={profileData.settlement}
                                onChange={e => handleFieldChange(e, setProfileData, setProfileErrors, profileSchema)}
                            />
                        </div>

                        {/* Street Type */}
                        <div className="col-lg-2 p-sm">
                            <div className="mb-xs"><b>Street type</b></div>
                            {profileErrors.streetType && <div className="error">{profileErrors.streetType}</div>}
                            <select
                                name="streetType"
                                className="input-md input-primary wp-100"
                                value={profileData.streetType}
                                onChange={e => handleFieldChange(e, setProfileData, setProfileErrors, profileSchema)}
                            >
                                <option value="">-</option>
                                <option value="street">street</option>
                                <option value="avenue">avenue</option>
                                <option value="road">road</option>
                                <option value="blvd">blvd</option>
                            </select>
                        </div>

                        {/* Street */}
                        <div className="col-lg-4 p-sm">
                            <div className="mb-xs"><b>Street</b></div>
                            {profileErrors.street && <div className="error">{profileErrors.street}</div>}
                            <input
                                name="street"
                                className="input-md input-primary wp-100"
                                value={profileData.street}
                                onChange={e => handleFieldChange(e, setProfileData, setProfileErrors, profileSchema)}
                            />
                        </div>

                        {/* House Number */}
                        <div className="col-lg-4 p-sm">
                            <div className="mb-xs"><b>House number</b></div>
                            {profileErrors.houseNumber && <div className="error">{profileErrors.houseNumber}</div>}
                            <NumberInput
                                name="houseNumber"
                                value={profileData.houseNumber}
                                setValue={val => handleNumberChange("houseNumber", val)}
                                from={1}
                                to={100000}
                                classes={["input-md", "input-primary", "wp-100"]}
                            />
                        </div>

                        {/* Floor */}
                        <div className="col-lg-4 p-sm">
                            <div className="mb-xs"><b>Floor</b></div>
                            {profileErrors.floorNumber && <div className="error">{profileErrors.floorNumber}</div>}
                            <NumberInput
                                name="floorNumber"
                                value={profileData.floorNumber}
                                setValue={val => handleNumberChange("floorNumber", val)}
                                from={0}
                                to={100000}
                                classes={["input-md", "input-primary", "wp-100"]}
                            />
                        </div>

                        {/* Door */}
                        <div className="col-lg-4 p-sm">
                            <div className="mb-xs"><b>Door</b></div>
                            {profileErrors.doorNumber && <div className="error">{profileErrors.doorNumber}</div>}
                            <NumberInput
                                name="doorNumber"
                                value={profileData.doorNumber}
                                setValue={val => handleNumberChange("doorNumber", val)}
                                from={0}
                                to={100000}
                                classes={["input-md", "input-primary", "wp-100"]}
                            />
                        </div>

                        {/* Save Button */}
                        <div className="col-xs-12">
                            <button className="input-md btn-primary" onClick={handleSave}>
                                Save
                            </button>
                        </div>

                    </div>
                </div>

                <div className="col-lg-6 col-md-6 p-sm">
                    <div className="box-light p-md">
                        <h2>Change password</h2>
                        <div className="row">
                            <div className="col-lg-4 p-sm">
                                <div className="mb-xs">
                                    <b>Current password</b>
                                </div>
                                {newPassErrors.pass && <div className="error">{newPassErrors.pass}</div>}

                                <input 
                                    type="password" name="pass" 
                                    onChange={e=>handleFieldChange(e, setNewPassData, setNewPassErrors, newPassSchema)}
                                    className="input-md input-primary wp-100" 
                                />
                            </div>

                            <div className="col-lg-4 p-sm">
                                <div className="mb-xs">
                                    <b>New password</b>
                                </div>
                                {newPassErrors.newPass && <div className="error">{newPassErrors.newPass}</div>}

                                <input 
                                    type="password" name="newPass" 
                                    onChange={e=>handleFieldChange(e, setNewPassData, setNewPassErrors, newPassSchema)}
                                    className="input-md input-primary wp-100" 
                                />
                            </div>

                            <div className="col-lg-4 p-sm">
                                <div className="mb-xs">
                                    <b>New again</b>
                                </div>

                                <div className="error">{newPassData?.newPass !== newPassData?.newPassAgain && newPassData.newPassAgain !== "" 
                                ? "A két jelszó nem egyezik" : ""}</div>

                                <input 
                                    type="password" name="newPassAgain" 
                                    onChange={e=>handleFieldChange(e, setNewPassData)}
                                    className="input-md input-primary wp-100" 
                                />
                            </div>
                        </div>

                        <button onClick={handleSavePass} className="input-md btn-primary">Save</button>

                        <h2>Change email</h2>
                        
                        <div className="row">
                            <div className="col-lg-6 p-sm">
                                <div className="mb-xs">
                                    <b>Email</b>
                                </div>
                                {emailError && <div className="error">{emailError}</div>}

                                <input 
                                    type="email" name="email" value={email}
                                    onChange={e=>setSingleInput(e.target, emailSchema, setEmail, setEmailError)}
                                    className="input-md input-primary wp-100" 
                                />
                            </div>

                            <div className="col-lg-6 p-sm">
                                <div className="mb-xs">
                                    <b>Password</b>
                                </div>
                                <input 
                                    type="password" name="newPass" 
                                    value={pass} onChange={e=>setPass(e.target.value)}
                                    className="input-md input-primary wp-100" 
                                />
                            </div>

                        </div>

                        <button onClick={updatePass} className="input-md btn-primary">Save</button>

                        <input type="file" onChange={e=>uploadProfileImage(e.target)} multiple/>
                    </div>
                </div>
            </div>
        </div>
    );
}