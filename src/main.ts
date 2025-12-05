import express from "express"
import { PORT } from "./utils/env-util"
import { publicRouter } from "./routes/public-api.ts"
import { errorMiddleware } from "./middlewares/error-middleware.ts";

const app = express();

app.use(express.json());
app.use("/api", publicRouter)
app.use(errorMiddleware)

app.listen(PORT || 3000, () => {
    console.log(`Connected to port ${PORT}`);
})