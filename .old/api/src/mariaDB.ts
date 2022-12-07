import * as mariadb from "mariadb";

/*
	Namespace: MariaDB
	Description: The namespace for the MariaDB connector.
*/
namespace MariaDB {
	/*
		Interface: Config
		Description: The configuration for the MariaDB connector.
	*/
	export interface Config {
		host: string;
		user: string;
		password: string;
		database: string;
		connectionLimit: number;
	}

	/*
		Class: Connector
		Description: The connector for MariaDB.
	*/
	export class Connector {
		/*
			Property: pool
			Type: mariadb.Pool
			Description: The pool of connections to the database.
		*/
		private pool: mariadb.Pool;

		/*
			Constructor
			Parameters:
				config - The configuration for the connector.
		*/
		constructor(config: Config) {
			if (config.host === undefined) {
				throw new Error("MariaDB host is undefined");
			}
			if (config.user === undefined) {
				throw new Error("MariaDB user is undefined");
			}
			if (config.password === undefined) {
				throw new Error("MariaDB password is undefined");
			}
			if (config.database === undefined) {
				throw new Error("MariaDB database is undefined");
			}
			if (config.connectionLimit === undefined) {
				throw new Error("MariaDB connection limit is undefined");
			}

			// Create the pool
			this.pool = mariadb.createPool(config);
		}

		/*
			Method: query
			Description: Executes a query.
			Parameters:
				query - The query to execute.
			Returns:
				result - The result of the query.
		*/
		public async query(query: string): Promise<any | undefined> {
			try {
				// Get a connection from the pool
				const connection = await this.pool.getConnection();

				// Execute the query
				const result = await connection.query(query);

				// Release the connection
				connection.release();

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
			Method: preparedQuery
			Description: Prepares a query and executes it.
			Parameters:
				query - The query to execute.
				values - The values to use in the query.
			Returns:
				result - The result of the query.
		*/
		public async preparedQuery(query: string, values: any[]): Promise<any | undefined> {
			try {
				// Get a connection from the pool
				const connection = await this.pool.getConnection();

				// Prepare the query
				const preparedQuery = await connection.prepare(query);

				// Execute the query
				const result = await preparedQuery.execute(values);

				// Release the connection
				connection.release();

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

	/*
		Class: Base
		Description: The base class for classes that interact with the database.
	*/
	export class Base {
		/*
			Property: connector
			Type: Connector
			Description: The connector to the database.
		*/
		protected connector: Connector;

		/*
			Constructor
			Parameters:
				connector - The connector to the database.
		*/
		constructor(connector: Connector) {
			if (connector === undefined) {
				throw new Error("MariaDB connector is undefined");
			}
			this.connector = connector;
		}
	}
}

export default MariaDB;
