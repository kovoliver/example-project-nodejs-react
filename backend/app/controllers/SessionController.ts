import { Request, Response } from "express";
import { Get, RouteController } from "../framework/decorators.js";
import tokenHandler from "../framework/JWToken.js";

@RouteController("/session")
class SessionController {

    @Get("/logout", tokenHandler.authenticate.bind(tokenHandler))
    public async logout(req:Request, res:Response) {
        try {
            await tokenHandler.logout(req.user.uuID, req.cookies.refresh_token);

            res.clearCookie("refresh_token", {
                httpOnly: true,
                secure: true,
                sameSite: process.env.NODE_ENV === "development" ? "none" : "lax",
                path: "/"
            });

            res.json({message:"You've successfully logged out!"});
        } catch (err: any) {
            console.error(err);
            return res.status(500).json({
                status: 500,
                message: err.message || "Unexpected error during login.",
            });
        }
    }
}

export default SessionController;