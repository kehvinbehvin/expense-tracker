import app from "./app"
import logger from "./utils/logger/src/logger";
const { PORT } = process.env

app.listen(PORT, () => {
    logger.log("info",`Application listening at port ${PORT}`)
})