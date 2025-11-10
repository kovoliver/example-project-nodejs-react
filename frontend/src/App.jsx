import { createContext, useState } from "react";
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
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'; 

library.add(
    faCircleXmark
);

export const GlobalContext = createContext();

function App() {
    const user = {userName:"Sanyi", isLoggedIn:false, isAdmin:false, userID:11};
    const [messages, setMsgs] = useState({messages:[], msgCls:"info", maxWidth:500});

    const setMessages = (messages, msgCls = "info", maxWidth = 500)=> {
        const msgs = Array.isArray(messages) ? messages : [messages];
        setMsgs({messages:msgs, msgCls, maxWidth});
    };

    return (
        <GlobalContext.Provider value={{user, messages, setMessages}}>
            <BrowserRouter>
                <Routes>
                    {/* Guest routes */}
                    <Route element={<GuestLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/confirm-registration" element={<ConfirmRegistration />} />
                    </Route>

                    {/* <Route
                        element={
                            <UserLayout />
                        }
                    >
                        <Route path="/dashboard" element={<UserDashboard />} />
                    </Route>

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