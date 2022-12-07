// import MariaDBConnector from "../mariadbconnector";
// import crypto from "crypto";

// // Tables used by the authentication system
// /*
// 	Sessions table
// 	- session_id
// 	- user_id - user_id of the user who is logged in, or NULL if the session is unauthenticated
// 	- token
// 	- last_accessed
// 	- expires
// */

// class Session {
// 	/*
// 		Property: connector
// 		Type: MariaDBConnector
// 		Description: The MariaDBConnector instance.
// 	*/
// 	private connector: MariaDBConnector;

// 	// Constructor
// 	constructor(connector: MariaDBConnector) {
// 		if (connector === undefined) throw new Error("Session: Connector is undefined");
// 		this.connector = connector;
// 	}

// 	/*
// 		Method: create
// 		Description: Creates a new session with a 64 character token and a 30 minute expiry without a user_id (this is an unauthenticated session, which is used for logging in and registering).
// 		Parameters: None
// 		Returns:
// 			- session_id
// 			- hashed_token
// 	*/
// 	public async create(): Promise<{ session_id: number; hashed_token: string } | undefined> {
// 		try {
// 			// Get a connection from the pool
// 			const connection = await this.connector.connect();

// 			// Loop until we get a unique token
// 			let token: string;
// 			while (true) {
// 				// Generate a new token
// 				token = crypto.randomBytes(32).toString("hex");

// 				// Check if the token is unique
// 				const result = await this.connector.preparedQuery(
// 					connection,
// 					"SELECT session_id FROM sessions WHERE token = ?",
// 					[token]
// 				);

// 				// If the token is unique, break the loop
// 				if (result.length === 0) break;
// 			}

// 			// Insert the session into the database
// 			const result = await this.connector.preparedQuery(
// 				connection,
// 				"INSERT INTO sessions (token, last_accessed, expires) VALUES (?, NOW(), NOW() + INTERVAL 30 MINUTE)",
// 				[token]
// 			);

// 			// Hash the token with the session_id
// 			const hashed_token = crypto
// 				.createHash("sha256")
// 				.update(`${result.insertId}${token}`)
// 				.digest("hex");

// 			// Return the session_id and hashed_token
// 			return { session_id: result.insertId, hashed_token };
// 		} catch (error) {
// 			// Log the error
// 			console.error(error);

// 			// Return undefined
// 			return undefined;
// 		}
// 	}

// 	/*
// 		Method: validate
// 		Description: Validates a session by check if the given session_id and hashed_token have a valid session (if user_id is provided, it will also check if the user_id matches the user_id in the session).
// 		Parameters:
// 			- session_id
// 			- hashed_token
// 			- user_id
// 		Returns:
// 			- session_id
// 			- hashed_token
// 	*/
// 	public async validate(
// 		session_id: number,
// 		hashed_token: string,
// 		user_id?: number
// 	): Promise<boolean> {
// 		try {
// 			// Get a connection from the pool
// 			const connection = await this.connector.connect();

// 			// Check if the session exists
// 			let session;
// 			if (user_id) {
// 				session = await this.connector.preparedQuery(
// 					connection,
// 					"SELECT session_id, token FROM sessions WHERE session_id = ? AND user_id = ?",
// 					[session_id, user_id]
// 				);
// 			} else {
// 				session = await this.connector.preparedQuery(
// 					connection,
// 					"SELECT session_id, token FROM sessions WHERE session_id = ? AND user_id IS NULL",
// 					[session_id]
// 				);
// 			}

// 			// Check if the session exists
// 			if (session.length === 0) return false;

// 			// Check if the token is correct
// 			if (
// 				hashed_token !==
// 				crypto.createHash("sha256").update(`${session_id}${session[0].token}`).digest("hex")
// 			)
// 				return false;

// 			// Update the last_accessed
// 			await this.connector.preparedQuery(
// 				connection,
// 				"UPDATE sessions SET last_accessed = NOW() WHERE session_id = ?",
// 				[session_id]
// 			);

// 			// Return true
// 			return true;
// 		} catch (error) {
// 			// Log the error
// 			console.error(error);

// 			// Return false
// 			return false;
// 		}
// 	}

// 	/*
// 		Method: authenticate
// 		Description: Authenticates a session by adding a user_id to the session and setting the expiry to 30 days, then generates a new token.
// 		Parameters:
// 			- session_id
// 			- hashed_token
// 			- user_id
// 		Returns:
// 			- session_id
// 			- hashed_token
// 	*/
// 	public async authenticate(
// 		session_id: number,
// 		hashed_token: string,
// 		user_id: number
// 	): Promise<{ session_id: number; hashed_token: string } | undefined> {
// 		try {
// 			// Get a connection from the pool
// 			const connection = await this.connector.connect();

// 			// Validate the session
// 			if (!(await this.validate(session_id, hashed_token))) return undefined;

// 			// Loop until we get a unique token
// 			let token: string;
// 			while (true) {
// 				// Generate a new token
// 				token = crypto.randomBytes(32).toString("hex");

// 				// Check if the token is unique
// 				const result = await this.connector.preparedQuery(
// 					connection,
// 					"SELECT session_id FROM sessions WHERE token = ?",
// 					[token]
// 				);

// 				// If the token is unique, break the loop
// 				if (result.length === 0) break;
// 			}

// 			// Update the session
// 			await this.connector.preparedQuery(
// 				connection,
// 				"UPDATE sessions SET user_id = ?, token = ?, last_accessed = NOW(), expires = NOW() + INTERVAL 30 DAY WHERE session_id = ?",
// 				[user_id, token, session_id]
// 			);

// 			// Hash the token with the session_id
// 			const new_hashed_token = crypto
// 				.createHash("sha256")
// 				.update(`${session_id}${token}`)
// 				.digest("hex");

// 			// Return the session_id and hashed_token
// 			return { session_id, hashed_token: new_hashed_token };
// 		} catch (error) {
// 			// Log the error
// 			console.error(error);

// 			// Return undefined
// 			return undefined;
// 		}
// 	}

// 	/*
// 		Method: delete
// 		Description: Deletes a session.
// 		Parameters:
// 			- session_id
// 			- hashed_token
// 			- user_id?
// 	*/
// 	public async delete(
// 		session_id: number,
// 		hashed_token: string,
// 		user_id?: number
// 	): Promise<boolean | undefined> {
// 		try {
// 			// Get a connection from the pool
// 			const connection = await this.connector.connect();

// 			// Validate the session
// 			if (!(await this.validate(session_id, hashed_token, user_id))) return false;

// 			// Delete the session
// 			await this.connector.preparedQuery(connection, "DELETE FROM sessions WHERE session_id = ?", [
// 				session_id,
// 			]);

// 			// Return true
// 			return true;
// 		} catch (error) {
// 			// Log the error
// 			console.error(error);

// 			// Return undefined
// 			return undefined;
// 		}
// 	}
// }

// export default Session;
