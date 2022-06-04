import logger from "../logger/src/logger"
import {Request, Response, NextFunction} from "express";
import {BaseError} from "./src/BaseError";

function errorHandler (error: BaseError, req: Request, res: Response, next: NextFunction) {
    const response = {
        "Error message": `${error.message}`,
    }
    return res.json(response).status(error.statusCode);
}

export default errorHandler;