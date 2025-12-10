import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GuestLayout from "./layouts/GuestLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import HomePage from "./pages/HomePage";
import "./assets/scss/style.scss";
import ConfirmRegistration from "./pages/ConfirmRegistration";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCircleXmark, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'; 
import TwoFactorLogin from "./pages/TwoFactorLogin";
import ProfilePage from "./pages/common/ProfilePage";
import CarsPage from "./pages/user_pages/CarsPage";
import CarPage from "./pages/user_pages/CarPage";
import SearchPage from "./pages/SearchPage";
import CarPublicPage from "./pages/CarPublicPage";

library.add(
    faCircleXmark, 
    faChevronLeft,
    faChevronRight
);

export const GlobalContext = createContext();

function App() {
    const [messages, setMsgs] = useState({messages:[], msgCls:"info", maxWidth:500});
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [sessionInfo, setSessionInfo] = useState(JSON.parse(localStorage.getItem("sessionInfo")));
    const [loggedIn, setLoggedIn] = useState(sessionInfo !== null);
    const [loginPath, setLoginPath] = useState("/");

    const setMessages = (messages, msgCls = "info", maxWidth = 500)=> {
        const msgs = Array.isArray(messages) ? messages : [messages];
        setMsgs({messages:msgs, msgCls, maxWidth});
    };

    useEffect(()=> {
        if(!sessionInfo || !sessionInfo.role) return;
        setLoggedIn(true);

        const path = "/" + sessionInfo?.role.toString().toLowerCase();
        setLoginPath(path);
    }, [sessionInfo]);

    return (
        <GlobalContext.Provider value={{
            messages,
            setMessages,
            token,
            setToken,
            sessionInfo,
            setSessionInfo,
            loggedIn,
            loginPath
        }}>
            <BrowserRouter>
                <Routes>
                    {/* Guest routes */}
                    <Route element={<GuestLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/confirm-registration" element={<ConfirmRegistration />} />
                        <Route path="/two-factor-login/:userID/:key" element={<TwoFactorLogin />} />
                        <Route path="/search" element={<SearchPage/>}/>
                        <Route path="/car/:carUrlData" element={<CarPublicPage/>}/>
                    </Route>

                    <Route element={<UserLayout />}>
                        <Route path="/user/profile" element={<ProfilePage />} />
                        <Route path="/user/cars" element={<CarsPage />} />
                        <Route path="/user/car" element={<CarPage />} />
                        <Route path="/user/car/:carID" element={<CarPage />} />
                    </Route>

                    {/* 

                    <Route
                        element={
                            <AdminLayout />
                        }
                    >
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route> */}
                </Routes>
            </BrowserRouter>
        </GlobalContext.Provider>
    )
}

export default App