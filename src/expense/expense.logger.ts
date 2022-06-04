import logger from "../utils/logger/src/logger"

const expenseLogChannel = logger.child({
    channel: 'expense' ,
})

export default expenseLogChannel;