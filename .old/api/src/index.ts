// Import node modules
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

// Import my modules
import Validate from "./validate.js";
import MariaDB from "./mariaDB.js";
import Wishlist from "./routes/wishlist.js";
import Wish from "./routes/wish.js";

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

// Create a new Validate instance
const validate = new Validate();

// Create a new MariaDB.Connector instance
const connector = new MariaDB.Connector({
	host: process.env.DB_HOST!,
	user: process.env.DB_USER!,
	password: process.env.DB_PASSWORD!,
	database: "vendel",
	connectionLimit: 10,
});

// Create a new Wishlist instance
const wishlist = new Wishlist(connector);

// Create a new Wish instance
const wish = new Wish(connector);

/*
	Interface: Response
	Description: The response interface.
*/
interface Response {
	status: number;
	message: string;
	date: string;
	data?: any;
}

/*
	Endpoint: GET /
	Description: Ping the server.
	Authentication: None
*/
app.get("/", (req: express.Request, res: express.Response) => {
	// Send a response
	sendResponse(res, {
		status: 200,
		message: "API is up and running.",
		date: new Date().toISOString(),
	});
});

/*
	Endpoint: GET /wishlists
	Description: Gets all wishlists.
	Authentication: None
*/
app.get("/wishlists", async (req: express.Request, res: express.Response) => {
	// Get all wishlists
	const wishlists = await wishlist.get();

	// If undefined, send a 500 response
	if (wishlists === undefined) {
		sendResponse(res, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send success response
	sendResponse(res, {
		status: 200,
		message: "Fetched all wishlists.",
		date: new Date().toISOString(),
		data: wishlists,
	});
});

/*
	Endpoint: GET /wishlists/:id
	Description: Gets a wishlist.
	Authentication: None
*/
app.get("/wishlists/:wishlist_id", async (req: express.Request, res: express.Response) => {
	// Get the id
	const wishlist_id = Number(req.params.wishlist_id);

	// If the id is not a number, send a 400 response
	if (!validate.number(wishlist_id)) {
		sendResponse(res, {
			status: 400,
			message: "Bad request.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Check if the wishlist exists
	const wishlistExists = await wishlist.exists(wishlist_id);

	// If undefined, send a 500 response
	if (wishlistExists === undefined) {
		sendResponse(res, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// If the wishlist does not exist, send a 404 response
	if (!wishlistExists) {
		sendResponse(res, {
			status: 404,
			message: "Wishlist not found.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send success response
	sendResponse(res, {
		status: 200,
		message: "Fetched wishlist.",
		date: new Date().toISOString(),
		data: await wishlist.getOne(wishlist_id),
	});
});

/* 
	Endpoint: GET /wishlists/access/:wishlist_id
	Description: Gets the access entries for a wishlist.
	Authentication: None
*/
app.get("/wishlists/access/:wishlist_id", async (req: express.Request, res: express.Response) => {
	// Get the id
	const wishlist_id = Number(req.params.wishlist_id);

	// If the id is not a number, send a 400 response
	if (!validate.number(wishlist_id)) {
		sendResponse(res, {
			status: 400,
			message: "Bad request.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Check if the wishlist exists
	const wishlistExists = await wishlist.exists(wishlist_id);

	// If undefined, send a 500 response
	if (wishlistExists === undefined) {
		sendResponse(res, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// If the wishlist does not exist, send a 404 response
	if (!wishlistExists) {
		sendResponse(res, {
			status: 404,
			message: "Wishlist not found.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send success response
	sendResponse(res, {
		status: 200,
		message: "Fetched access entries.",
		date: new Date().toISOString(),
		data: await wishlist.getAccess(wishlist_id),
	});
});

/*
	Endpoint: GET /wishlists/:wishlist_Id/:wish_Id
	Description: Gets a wish.
	Authentication: None
*/
app.get("/wishlists/:wishlist_id/:wish_id", async (req: express.Request, res: express.Response) => {
	// Get the ids
	const wishlist_id = Number(req.params.wishlist_id);
	const wish_id = Number(req.params.wish_id);

	// If the ids are not numbers, send a 400 response
	if (!validate.number(wishlist_id) || !validate.number(wish_id)) {
		sendResponse(res, {
			status: 400,
			message: "Bad request.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Check if the wishlist exists
	const wishlistExists = await wishlist.exists(wishlist_id);

	// If undefined, send a 500 response
	if (wishlistExists === undefined) {
		sendResponse(res, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// If the wishlist does not exist, send a 404 response
	if (!wishlistExists) {
		sendResponse(res, {
			status: 404,
			message: "Wishlist not found.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Check if the wish exists
	const wishExists = await wish.exists(wishlist_id, wish_id);

	// If undefined, send a 500 response
	if (wishExists === undefined) {
		sendResponse(res, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// If the wish does not exist, send a 404 response
	if (!wishExists) {
		sendResponse(res, {
			status: 404,
			message: "Wish not found.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send success response
	sendResponse(res, {
		status: 200,
		message: "Fetched wish.",
		date: new Date().toISOString(),
		data: await wish.get(wishlist_id, wish_id),
	});
});

/*
	Start the server
*/
app.listen(process.env.PORT, () => {
	console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

function sendResponse(responseFunction: express.Response, responseDetails: Response): void {
	// Create a response
	let response: Response = {
		status: responseDetails.status,
		message: responseDetails.message,
		date: responseDetails.date,
	};
	if (responseDetails.data !== undefined) {
		response.data = responseDetails.data;
	}

	// Send the response
	responseFunction.status(response.status).json(response);
}
