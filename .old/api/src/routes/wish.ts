// Import MariaDB namespace
import MariaDB from "../mariaDB.js";

/*
	Table: wishes
	Description: The wishes table.
	Schema:
		- wish_id: int(11) (primary key, auto increment)
		- wishlist_id: int(11) (foreign key)
		- category_id: int(11) (foreign key)
		- item: tinyText
		- misc: tinyText
		- price: decimal(10,2)
		- link: text
		- last_updated: dateTime

	Table: wishlist_access
	Description: The wishlist access table.
	Schema:
		- wishlist_access_id: int(11) (primary key, auto increment)
		- wishlist_id: int(11) (foreign key)
		- user_id: int(11) (foreign key)
*/

/*
	Class: Wish
	Description: The Wish class, which contains all the methods for the wish table.
*/
class Wish extends MariaDB.Base {
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
			return result;
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
			- category_id: number
			- item: string
			- misc: string
			- price: number
			- link: string
	*/
	public async create(
		wishlist_id: number,
		category_id: number,
		item: string,
		misc: string,
		price: number,
		link: string
	): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"INSERT INTO wishes (wishlist_id, category_id, item, misc, price, link, NOW()) VALUES (?, ?, ?, ?, ?, ?, ?)",
				[wishlist_id, category_id, item, misc, price, link]
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
		Method: update
		Description: Updates a wish.
		Parameters:
			- wishlist_id: number
			- wish_id: number
			- category_id: number
			- item: string
			- misc: string
			- price: number
			- link: string
	*/
	public async update(
		wishlist_id: number,
		wish_id: number,
		category_id: number,
		item: string,
		misc: string,
		price: number,
		link: string
	): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"UPDATE wishes SET category_id = ?, item = ?, misc = ?, price = ?, link = ?, NOW() WHERE wishlist_id = ? AND wish_id = ?",
				[category_id, item, misc, price, link, wishlist_id, wish_id]
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
	public async exists(wishlist_id: number, wish_id: number): Promise<boolean | undefined> {
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
			return undefined;
		}
	}
}

// Export the class
export default Wish;
