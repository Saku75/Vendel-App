// Import node modules
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Import my modules
import { MariaDBConfig, MariaDBConnector } from "./mariadb/connector.js";
import Session from "./mariadb/session.js";

// Import settings from .env file
dotenv.config();

// Create a new express application instance
const app: express.Application = express();

// Use node modules
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));

// Create a new MariaDBConnector object
const connector = new MariaDBConnector({
	host: process.env.MARIADB_HOST!,
	user: process.env.MARIADB_USER!,
	password: process.env.MARIADB_PASSWORD!,
	database: process.env.MARIADB_DATABASE!,
	connectionLimit: 5,
});

const session = new Session(connector);

// Response template
interface Response {
	status: number;
	message: string;
	data?: any;
}

/*
	Endpoint: /session/create
	Description: Creates a new session via Session.createSession() and returns the session_id and hashed_token as cookies.
*/
app.get("/session/create", (req, res) => {
	session
		.create()
		.then((result) => {
			// If the result is undefined, return an error
			if (result === undefined) {
				const response: Response = {
					status: 500,
					message: "Internal server error",
				};
				res.json(response);
			}

			// Otherwise, return the session_id and hashed_token as cookies that expire in 30 minutes
			res.cookie("session_id", result?.session_id, {
				maxAge: 30 * 60 * 1000,
				httpOnly: true,
				sameSite: "strict",
				secure: true,
			});
			res.cookie("session_token", result?.hashed_token, {
				maxAge: 30 * 60 * 1000,
				httpOnly: true,
				sameSite: "strict",
				secure: true,
			});

			// Return a success message
			const response: Response = {
				status: 200,
				message: "Session created",
			};
			res.json(response);
		})
		.catch((error) => {
			// If there is an error, log it and return an error
			console.error(error);
			const response: Response = {
				status: 500,
				message: "Internal server error",
			};
			res.json(response);
		});
});

/*
	Endpoint: /session/delete
	Description: Deletes a session via Session.delete() and clearas the session_id, session_token, and session_user (if set) cookies.
*/
app.get("/session/delete", (req, res) => {
	// Get cookies
	const session_id = req.cookies.session_id;
	const session_token = req.cookies.session_token;
	const session_user = req.cookies.session_user;

	// If the session_id or session_token cookies are not set, return an error
	if (session_id === undefined || session_token === undefined) {
		const response: Response = {
			status: 400,
			message: "Bad request",
		};
		res.json(response);
	}

	// Otherwise, delete the session
	session
		.delete(session_id, session_token, session_user)
		.then((result) => {
			// If the result is undefined, return an error
			if (result === undefined) {
				const response: Response = {
					status: 500,
					message: "Internal server error",
				};
				res.json(response);
			}

			// If the result is false, return an error
			if (result === false) {
				const response: Response = {
					status: 400,
					message: "Bad request",
				};
				res.json(response);
			}

			// Otherwise, clear the session_id, session_token, and session_user cookies
			res.clearCookie("session_id");
			res.clearCookie("session_token");
			res.clearCookie("session_user");

			// Return a success message
			const response: Response = {
				status: 200,
				message: "Session deleted",
			};
			res.json(response);
		})
		.catch((error) => {
			// If there is an error, log it and return an error
			console.error(error);
			const response: Response = {
				status: 500,
				message: "Internal server error",
			};
			res.json(response);
		});
});

// Start the server
app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
