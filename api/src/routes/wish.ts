// Import MariaDB namespace
import MariaDB from "../mariaDB.js";

/*
	Table: wishes
	Description: The wishes table.
	Schema:
		- wish_id: int(11) (primary key, auto increment)
		- wishlist_id: int(11) (foreign key)
		- wish_name: varchar(100)
		- wish_price: decimal(10,2)
		- wish_link: text
		- wish_last_updated: dateTime
*/

/*
	Class: Wish
	Description: The Wish class, which contains all the methods for the wish table.
*/
class Wish extends MariaDB.Base {
	/*
		Method: getAll
		Description: Gets all wishes from a wishlist.
		Parameters:
			- wishlist_id: number
	*/
	public async getAll(wishlist_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"SELECT * FROM wishes WHERE wishlist_id = ?",
				[wishlist_id]
			);

			// Return the result
			return result;
		} catch (error) {
			// Log the error
			console.error(error);

			// Return undefined
			return undefined;
		}
	}

	/*
		Method: get
		Description: Gets a wish.
		Parameters:
			- wishlist_id: number
			- wish_id: number
	*/
	public async get(wishlist_id: number, wish_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"SELECT * FROM wishes WHERE wishlist_id = ? AND wish_id = ?",
				[wishlist_id, wish_id]
			);

			// Return the result
			return result[0];
		} catch (error) {
			// Log the error
			console.error(error);

			// Return undefined
			return undefined;
		}
	}

	/*
		Method: create
		Description: Creates a wish.
		Parameters:
			- wishlist_id: number
			- wish_name: string
			- wish_price: number
			- wish_link: string
	*/
	public async create(
		wishlist_id: number,
		wish_name: string,
		wish_price: number,
		wish_link: string
	): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"INSERT INTO wishes (wishlist_id, wish_name, wish_price, wish_link, wish_last_updated) VALUES (?, ?, ?, ?, NOW())",
				[wishlist_id, wish_name, wish_price, wish_link]
			);

			// Remove n from insertId
			result.insertId = Number(result.insertId);

			// Return the result
			return result;
		} catch (error) {
			// Log the error
			console.error(error);

			// Return undefined
			return undefined;
		}
	}

	/*
		Method: update
		Description: Updates a wish.
		Parameters:
			- wishlist_id: number
			- wish_id: number
			- wish_name: string
			- wish_price: number
			- wish_link: string
	*/
	public async update(
		wishlist_id: number,
		wish_id: number,
		wish_name: string,
		wish_price: number,
		wish_link: string
	): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"UPDATE wishes SET wish_name = ?, wish_price = ?, wish_link = ?, wish_last_updated = NOW() WHERE wishlist_id = ? AND wish_id = ?",
				[wish_name, wish_price, wish_link, wishlist_id, wish_id]
			);

			// Remove n from insertId
			result.insertId = Number(result.insertId);

			// Return the result
			return result;
		} catch (error) {
			// Log the error
			console.error(error);

			// Return undefined
			return undefined;
		}
	}

	/*
		Method: delete
		Description: Deletes a wish.
		Parameters:
			- wishlist_id: number
			- wish_id: number
	*/
	public async delete(wishlist_id: number, wish_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"DELETE FROM wishes WHERE wishlist_id = ? AND wish_id = ?",
				[wishlist_id, wish_id]
			);

			// Remove n from insertId
			result.insertId = Number(result.insertId);

			// Return the result
			return result;
		} catch (error) {
			// Log the error
			console.error(error);

			// Return undefined
			return undefined;
		}
	}

	/*
		Method: exists
		Description: Checks if a wish exists.
		Parameters:
			- wishlist_id: number
			- wish_id: number
	*/
	public async exists(wishlist_id: number, wish_id: number): Promise<boolean> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"SELECT * FROM wishes WHERE wishlist_id = ? AND wish_id = ?",
				[wishlist_id, wish_id]
			);

			// Return the result
			return result.length > 0;
		} catch (error) {
			// Log the error
			console.error(error);

			// Return false
			return false;
		}
	}
}

// Export the class
export default Wish;
