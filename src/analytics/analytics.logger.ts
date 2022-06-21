import logger from "../utils/logger/src/logger"

const analyticsLogChannel = logger.child({
    channel: 'analytics' ,
})

export default analyticsLogChannel;