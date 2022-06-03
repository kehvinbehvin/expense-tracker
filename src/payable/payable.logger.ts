import logger from "../logger/src/logger"

const payableLogChannel = logger.child({
    channel: 'payable' ,
})

export default payableLogChannel;