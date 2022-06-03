import logger from "../logger/src/logger"

const userLogger = logger.child({
   channel: 'user' ,
})

export default userLogger;