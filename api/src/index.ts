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

// Set TZ to Europe/Copenhagen
process.env.TZ = "Europe/Copenhagen";

// Check if PORT is set
if (process.env.PORT === undefined) {
	throw new Error("PORT is not set.");
}

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
	database: "vendel_demo",
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
	Endpoint: GET /ping
	Description: Ping the server.
*/
app.get("/ping", (request: express.Request, response: express.Response) => {
	// Send a response
	sendResponse(response, {
		status: 200,
		message: "Pong!",
		date: new Date().toISOString(),
	});
});

/*
	Endpoint: GET /wishlists
	Description: Gets all wishlists.
*/
app.get("/wishlists", async (request: express.Request, response: express.Response) => {
	// Get all wishlists
	const result = await wishlist.getAll();

	// Check if the result is undefined
	if (result === undefined) {
		// Send a response
		sendResponse(response, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send a response
	sendResponse(response, {
		status: 200,
		message: "Fetched wishlists.",
		date: new Date().toISOString(),
		data: result,
	});
});

/*
	Endpoint: GET /wishlists/:wishlist_id
	Description: Gets a wishlist.
*/
app.get("/wishlists/:wishlist_id", async (request: express.Request, response: express.Response) => {
	// Get the wishlist id
	const wishlistId = Number(request.params.wishlist_id);

	// Check if the wishlist id is valid
	if (!validate.number(request.params.wishlist_id)) {
		// Send a response
		sendResponse(response, {
			status: 400,
			message: "Bad request.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Check if the wishlist exists
	if (!(await wishlist.exists(wishlistId))) {
		// Send a response
		sendResponse(response, {
			status: 404,
			message: "Wishlist not found.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Get the wishlist
	const result = await wishlist.get(wishlistId);

	// Check if the result is undefined
	if (result === undefined) {
		// Send a response
		sendResponse(response, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send a response
	sendResponse(response, {
		status: 200,
		message: "Fetched wishlist.",
		date: new Date().toISOString(),
		data: result,
	});
});

/*
	Endpoint: POST /wishlists
	Description: Creates a wishlist.
*/
app.post("/wishlists", async (request: express.Request, response: express.Response) => {
	// Get the wishlist name
	const wishlistName = request.body.wishlist_name;
	const wishlistDate = request.body.wishlist_date;

	// Check if the wishlist name and date is valid
	if (!validate.name(wishlistName) || !validate.date(wishlistDate)) {
		// Send a response
		sendResponse(response, {
			status: 400,
			message: "Bad request.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Create a wishlist
	const result = await wishlist.create(wishlistName, wishlistDate);

	// Check if the result is undefined
	if (result === undefined) {
		// Send a response
		sendResponse(response, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send a response
	sendResponse(response, {
		status: 201,
		message: "Created wishlist.",
		date: new Date().toISOString(),
		data: result,
	});
});

/*
	Endpoint: PUT /wishlists/:wishlist_id
	Description: Updates a wishlist.
*/
app.put("/wishlists/:wishlist_id", async (request: express.Request, response: express.Response) => {
	// Get the wishlist id
	const wishlistId = Number(request.params.wishlist_id);
	const wishlistName = request.body.wishlist_name;
	const wishlistDate = request.body.wishlist_date;

	// Check if the wishlist id, name and date is valid
	if (
		!validate.number(request.params.wishlist_id) ||
		!validate.name(wishlistName) ||
		!validate.date(wishlistDate)
	) {
		// Send a response
		sendResponse(response, {
			status: 400,
			message: "Bad request.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Check if the wishlist exists
	if (!(await wishlist.exists(wishlistId))) {
		// Send a response
		sendResponse(response, {
			status: 404,
			message: "Wishlist not found.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Update the wishlist
	const result = await wishlist.update(wishlistId, wishlistName, wishlistDate);

	// Check if the result is undefined
	if (result === undefined) {
		// Send a response
		sendResponse(response, {
			status: 500,
			message: "Internal server error.",
			date: new Date().toISOString(),
		});
		return;
	}

	// Send a response
	sendResponse(response, {
		status: 200,
		message: "Updated wishlist.",
		date: new Date().toISOString(),
		data: result,
	});
});

/*
	Endpoint: DELETE /wishlists/:wishlist_id
	Description: Deletes a wishlist.
*/
app.delete(
	"/wishlists/:wishlist_id",
	async (request: express.Request, response: express.Response) => {
		// Get the wishlist id
		const wishlistId = Number(request.params.wishlist_id);

		// Check if the wishlist id is valid
		if (!validate.number(request.params.wishlist_id)) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wishlist exists
		if (!(await wishlist.exists(wishlistId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wishlist not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Delete the wishlist
		const result = await wishlist.delete(wishlistId);

		// Check if the result is undefined
		if (result === undefined) {
			// Send a response
			sendResponse(response, {
				status: 500,
				message: "Internal server error.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Send a response
		sendResponse(response, {
			status: 200,
			message: "Deleted wishlist.",
			date: new Date().toISOString(),
			data: result,
		});
	}
);

/*
	Endpoint: GET /wishlists/:wishlist_id/wishes
	Description: Gets all items from a wishlist.
*/
app.get(
	"/wishlists/:wishlist_id/wishes",
	async (request: express.Request, response: express.Response) => {
		// Get the wishlist id
		const wishlistId = Number(request.params.wishlist_id);

		// Check if the wishlist id is valid
		if (!validate.number(request.params.wishlist_id)) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wishlist exists
		if (!(await wishlist.exists(wishlistId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wishlist not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Get all items from the wishlist
		const result = await wish.getAll(wishlistId);

		// Check if the result is undefined
		if (result === undefined) {
			// Send a response
			sendResponse(response, {
				status: 500,
				message: "Internal server error.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Send a response
		sendResponse(response, {
			status: 200,
			message: "Got all items from wishlist.",
			date: new Date().toISOString(),
			data: result,
		});
	}
);

/*
	Endpoint: GET /wishlists/:wishlist_id/wishes/:wish_id
	Description: Gets a wish from a wishlist.
*/
app.get(
	"/wishlists/:wishlist_id/wishes/:wish_id",
	async (request: express.Request, response: express.Response) => {
		// Get the wishlist id
		const wishlistId = Number(request.params.wishlist_id);

		// Get the wish id
		const wishId = Number(request.params.wish_id);

		// Check if the wishlist id and wish id are valid
		if (!validate.number(request.params.wishlist_id) || !validate.number(request.params.wish_id)) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wishlist exists
		if (!(await wishlist.exists(wishlistId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wishlist not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wish exists
		if (!(await wish.exists(wishlistId, wishId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wish not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Get the wish
		const result = await wish.get(wishlistId, wishId);

		// Check if the result is undefined
		if (result === undefined) {
			// Send a response
			sendResponse(response, {
				status: 500,
				message: "Internal server error.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Send a response
		sendResponse(response, {
			status: 200,
			message: "Got wish.",
			date: new Date().toISOString(),
			data: result,
		});
	}
);

/*
	Endpoint: POST /wishlists/:wishlist_id/wishes
	Description: Creates a wish.
*/
app.post(
	"/wishlists/:wishlist_id/wishes",
	async (request: express.Request, response: express.Response) => {
		// Get the wishlist id
		const wishlistId = Number(request.params.wishlist_id);

		// Check if the wishlist id is valid
		if (!validate.number(request.params.wishlist_id)) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wishlist exists
		if (!(await wishlist.exists(wishlistId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wishlist not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Get wish name
		const wishName = request.body.wish_name;

		// Get wish price
		const wishPrice = Number(request.body.wish_price);

		// Get wish link
		const wishLink = request.body.wish_link;

		// Check if the wish name, price and link are valid
		if (
			!validate.name(wishName) ||
			!validate.number(request.body.wish_price) ||
			!validate.link(wishLink)
		) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Create the wish
		const result = await wish.create(wishlistId, wishName, wishPrice, wishLink);

		// Check if the result is undefined
		if (result === undefined) {
			// Send a response
			sendResponse(response, {
				status: 500,
				message: "Internal server error.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Update the wishlist last updated date
		await wishlist.updateLastUpdated(wishlistId);

		// Send a response
		sendResponse(response, {
			status: 201,
			message: "Created wish.",
			date: new Date().toISOString(),
			data: result,
		});
	}
);

/*
	Endpoint: PUT /wishlists/:wishlist_id/wishes/:wish_id
	Description: Updates a wish.
*/
app.put(
	"/wishlists/:wishlist_id/wishes/:wish_id",
	async (request: express.Request, response: express.Response) => {
		// Get the wishlist id and wish id
		const wishlistId = Number(request.params.wishlist_id);
		const wishId = Number(request.params.wish_id);

		// Check if the wishlist id and wish id are valid
		if (!validate.number(request.params.wishlist_id) || !validate.number(request.params.wish_id)) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wishlist exists
		if (!(await wishlist.exists(wishlistId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wishlist not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wish exists
		if (!(await wish.exists(wishlistId, wishId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wish not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Get wish name
		const wishName = request.body.wish_name;

		// Get wish price
		const wishPrice = Number(request.body.wish_price);

		// Get wish link
		const wishLink = request.body.wish_link;

		// Check if the wish name, price and link are valid
		if (
			!validate.name(wishName) ||
			!validate.number(request.body.wish_price) ||
			!validate.link(wishLink)
		) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Update the wish
		const result = await wish.update(wishlistId, wishId, wishName, wishPrice, wishLink);

		// Check if the result is undefined
		if (result === undefined) {
			// Send a response
			sendResponse(response, {
				status: 500,
				message: "Internal server error.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Update the wishlist last updated date
		await wishlist.updateLastUpdated(wishlistId);

		// Send a response
		sendResponse(response, {
			status: 200,
			message: "Updated wish.",
			date: new Date().toISOString(),
			data: result,
		});
	}
);

/*
	Endpoint: DELETE /wishlists/:wishlist_id/wishes/:wish_id
	Description: Deletes a wish.
*/
app.delete(
	"/wishlists/:wishlist_id/wishes/:wish_id",
	async (request: express.Request, response: express.Response) => {
		// Get the wishlist id and wish id
		const wishlistId = Number(request.params.wishlist_id);
		const wishId = Number(request.params.wish_id);

		// Check if the wishlist id and wish id are valid
		if (!validate.number(request.params.wishlist_id) || !validate.number(request.params.wish_id)) {
			// Send a response
			sendResponse(response, {
				status: 400,
				message: "Bad request.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wishlist exists
		if (!(await wishlist.exists(wishlistId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wishlist not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Check if the wish exists
		if (!(await wish.exists(wishlistId, wishId))) {
			// Send a response
			sendResponse(response, {
				status: 404,
				message: "Wish not found.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Delete the wish
		const result = await wish.delete(wishlistId, wishId);

		// Check if the result is undefined
		if (result === undefined) {
			// Send a response
			sendResponse(response, {
				status: 500,
				message: "Internal server error.",
				date: new Date().toISOString(),
			});
			return;
		}

		// Update the wishlist last updated date
		await wishlist.updateLastUpdated(wishlistId);

		// Send a response
		sendResponse(response, {
			status: 200,
			message: "Deleted wish.",
			date: new Date().toISOString(),
			data: result,
		});
	}
);

/*
	Start the server
*/
app.listen(process.env.PORT, () => {
	console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

/*
	Function: sendResponse
	Description: Sends a response.
	Parameters:
		- responseFunction: express.Response
		- responseDetails: Response
*/
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

	console.log(response);

	// Send the response
	responseFunction.status(response.status).json(response);
}
