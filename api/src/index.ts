// Import node modules
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Import my modules

// Import settings from .env file
dotenv.config({ path: ".env" });

console.log(process.env);

// Create a new express application instance
const app: express.Application = express();

// Use node modules
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// Use my modules

// Start the server
app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
