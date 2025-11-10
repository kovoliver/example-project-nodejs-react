import { Outlet } from "react-router-dom";
import GuestNav from "../components/GuestNav";
import Messages from "../components/Messages";

export default function GuestLayout() {
    return (
        <>
            <GuestNav />
            <div className="container-xl">
                <Messages/>
                <Outlet />
            </div>
        </>
    );
}