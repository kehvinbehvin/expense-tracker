import logger from "../logger/src/logger"
import {Request, Response, NextFunction} from "express";

const errorLogChannel = logger.child({
    channel: '' ,
})

function errorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
    res.status(500)
    errorLogChannel.log('error', { "Error": err })
}

export default errorHandler;