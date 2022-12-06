import * as mariadb from "mariadb";

interface MariaDBConfig {
	host: string;
	user: string;
	password: string;
	database: string;
	connectionLimit: number;
}

class MariaDBConnector {
	// Property: pool
	// Type: mariadb.Pool
	// Description: The pool of connections to the database.
	private pool: mariadb.Pool;

	// Constructor
	constructor(config: MariaDBConfig) {
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

	// Method: connect
	// Description: Gets a connection from the pool and returns it.
	public async connect(): Promise<mariadb.PoolConnection> {
		try {
			// Get a connection from the pool
			const connection = await this.pool.getConnection();

			// Return the connection
			return connection;
		} catch (error) {
			// Throw the error
			throw error;
		}
	}

	// Method: preparedQuery
	// Description: Prepares a query and executes it.
	public async preparedQuery(
		connection: mariadb.PoolConnection,
		query: string,
		values: any[]
	): Promise<any> {
		try {
			// Prepare the query
			const preparedQuery = await connection.prepare(query);

			// Execute the query
			const result = await preparedQuery.execute(values);

			// Return the result
			return result;
		} catch (error) {
			// Throw the error
			throw error;
		}
	}

	// Method: query
	// Description: Executes a query.
	public async query(connection: mariadb.PoolConnection, query: string): Promise<any> {
		try {
			// Execute the query
			const result = await connection.query(query);

			// Return the result
			return result;
		} catch (error) {
			// Throw the error
			throw error;
		}
	}

	// Method: release
	// Description: Releases a connection back to the pool.
	protected async release(connection: mariadb.PoolConnection): Promise<void> {
		try {
			// Release the connection
			await connection.release();
		} catch (error) {
			// Throw the error
			throw error;
		}
	}
}

export default MariaDBConnector;
export { MariaDBConfig, MariaDBConnector };
