// Import MariaDB namespace
import MariaDB from "../mariaDB.js";

/*
	Table: wishlist
	Description: The wishlist table.
	Schema:
		- wishlist_id: int(11) (primary key, auto increment)
		- name: varchar(100)
		- date: date
		- last_updated: dateTime
		
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
	Class: Wishlist
	Description: The Wishlist class, which contains all the methods for the wishlist table and wishlist_access table.
*/
class Wishlist extends MariaDB.Base {
	/*
		Method: get
		Description: Gets all wishlists.
	*/
	public async get(): Promise<any | undefined> {
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
		Method: getOne
		Description: Gets a wishlist.
		Parameters:
			- wishlist_id: number
	*/
	public async getOne(wishlist_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"SELECT wishes.wish_id, wishes.wishlist_id, categories.name, wishes.item, wishes.misc, wishes.price, wishes.link, wishes.last_updated FROM wishes INNER JOIN categories ON wishes.category_id = categories.category_id WHERE wishes.wishlist_id = ?",
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
		Method: create
		Description: Creates a wishlist.
		Parameters:
			- name: string
			- date: string
	*/
	public async create(name: string, date: string): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"INSERT INTO wishlists (name, date, NOW()) VALUES (?, ?)",
				[name, date]
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
		Description: Updates a wishlist.
		Parameters:
			- wishlist_id: number
			- name: string
			- date: string
	*/
	public async update(wishlist_id: number, name: string, date: string): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"UPDATE wishlists SET name = ?, date = ? WHERE wishlist_id = ?",
				[name, date, wishlist_id]
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
				"UPDATE wishlists SET last_updated = NOW() WHERE wishlist_id = ?",
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
		Method: getAccess
		Description: Gets all access entries for a wishlist.
		Parameters:
			- wishlist_id: number
	*/
	public async getAccess(wishlist_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"SELECT * FROM wishlist_access WHERE wishlist_id = ?",
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
		Method: createAccess
		Description: Creates an access entry for a wishlist.
		Parameters:
			- wishlist_id: number
			- user_id: number
	*/
	public async createAccess(wishlist_id: number, user_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"INSERT INTO wishlist_access (wishlist_id, user_id) VALUES (?, ?)",
				[wishlist_id, user_id]
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
		Method: deleteAccess
		Description: Deletes an access entry for a wishlist.
		Parameters:
			- wishlist_access_id: number
	*/
	public async deleteAccess(wishlist_access_id: number): Promise<any | undefined> {
		try {
			// Query the database
			const result = await this.connector.preparedQuery(
				"DELETE FROM wishlist_access WHERE wishlist_access_id = ?",
				[wishlist_access_id]
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
}

// Export the class
export default Wishlist;
