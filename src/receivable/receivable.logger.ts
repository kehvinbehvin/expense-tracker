import logger from "../logger/src/logger"

const receivableLogChannel = logger.child({
    channel: 'receivable' ,
})

export default receivableLogChannel;