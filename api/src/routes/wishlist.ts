// Import MariaDB namespace
import MariaDB from "../mariaDB.js";

/*
	Table: wishlist
	Description: The wishlist table.
	Schema:
		- wishlist_id: int(11) (primary key, auto increment)
		- wishlist_name: varchar(50)
		- wishlist_date: date
		- wishlist_last_updated: dateTime
		
	Table: wishes
	Description: The wishes table.
	Schema:
		- wish_id: int(11) (primary key, auto increment)
		- wishlist_id: int(11) (foreign key)
		- wish_name: varchar(100)
		- wish_price: decimal(10,2)
		- wish_link: text
*/

/*
	Class: Wishlist
	Description: The Wishlist class, which contains all the methods for the wishlist table and wishlist_access table.
*/
class Wishlist extends MariaDB.Base {
	/*
		Method: getAll
		Description: Gets all wishlists.
	*/
	public async getAll(): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.query("SELECT * FROM wishlists");

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
		Description: Gets a wishlist.
		Parameters:
			- wishlist_id: number
	*/
	public async get(wishlist_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"SELECT * FROM wishlists WHERE wishlist_id = ?",
				[wishlist_id]
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
		Description: Creates a wishlist.
		Parameters:
			- wishlist_name: string
			- wishlist_date: string
	*/
	public async create(wishlist_name: string, wishlist_date: string): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"INSERT INTO wishlists (wishlist_name, wishlist_date, wishlist_last_updated) VALUES (?, ?, NOW())",
				[wishlist_name, wishlist_date]
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
		Description: Updates a wishlist.
		Parameters:
			- wishlist_id: number
			- wishlist_name: string
			- wishlist_date: string
	*/
	public async update(
		wishlist_id: number,
		wishlist_name: string,
		wishlist_date: string
	): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"UPDATE wishlists SET wishlist_name = ?, wishlist_date = ?, wishlist_last_updated = NOW() WHERE wishlist_id = ?",
				[wishlist_name, wishlist_date, wishlist_id]
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
		Description: Deletes a wishlist.
		Parameters:
			- wishlist_id: number
	*/
	public async delete(wishlist_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"DELETE FROM wishlists WHERE wishlist_id = ?",
				[wishlist_id]
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
		Description: Checks if a wishlist exists.
		Parameters:
			- wishlist_id: number
	*/
	public async exists(wishlist_id: number): Promise<boolean | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"SELECT * FROM wishlists WHERE wishlist_id = ?",
				[wishlist_id]
			);

			// Return the result
			return result.length > 0;
		} catch (error) {
			// Log the error
			console.error(error);

			// Return undefined
			return undefined;
		}
	}

	/*
		Method: updateLastUpdated
		Description: Updates the last_updated column of a wishlist.
		Parameters:
			- wishlist_id: number
	*/
	public async updateLastUpdated(wishlist_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"UPDATE wishlists SET wishlist_last_updated = NOW() WHERE wishlist_id = ?",
				[wishlist_id]
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
}

// Export the class
export default Wishlist;
