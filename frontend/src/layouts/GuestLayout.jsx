import { Outlet } from "react-router-dom";
import GuestNav from "../components/GuestNav";

export default function GuestLayout() {
    return (
        <>
            <GuestNav />
            <div className="container-xl">
                <Outlet />
            </div>
        </>
    );
}