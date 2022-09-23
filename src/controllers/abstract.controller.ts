import { IRoute } from "express";

/** Provide a unified controller interface */
export interface AbstractController {

    /** Setup handling for route
     * 
     * It sets up how the different methods are going
     * to be handled by the controller.
     */
    setupRoute(route: IRoute): void;
}