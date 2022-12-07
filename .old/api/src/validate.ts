/*
	Class: Validate
	Description: The Validate class, which contains all the methods for validating data.
*/
class Validate {
	/*
		Method: number
		Description: Checks if a value is a number or can be converted to a number.
		Parameters:
			- value: any
	*/
	public number(value: any): boolean {
		// Check if the value is a number
		if (typeof value === "number") {
			// Return true
			return true;
		}

		// Check if the value can be converted to a number
		if (typeof value === "string" && !isNaN(Number(value))) {
			// Return true
			return true;
		}

		// Return false
		return false;
	}

	/*
		Method: safe
		Description: Checks if a value is safe for SQL and HTML.
		Parameters:
			- value: any
	*/
	public safe(value: any): boolean {
		// Check if the value is a string
		if (typeof value !== "string") {
			// Return false
			return false;
		}

		// Check if the value contains any SQL or HTML characters
		if (value.match(/['";<>]/)) {
			// Return false
			return false;
		}

		// Return true
		return true;
	}

	/*
		Method: date
		Description: Checks if a value is a date format valid for MySQL or can be converted to a date format valid for MySQL.
		Parameters:
			- value: any
	*/
	public date(value: any): boolean {
		// Check if the value is a date
		if (typeof value === "string" && !isNaN(Date.parse(value))) {
			// Return true
			return true;
		}

		// Return false
		return false;
	}

	/*
		Method: token
		Description: Checks if a value is a valid token.
		Parameters:
			- value: any
	*/
	public token(value: any): boolean {
		// Check if the value is a string
		if (typeof value !== "string") {
			// Return false
			return false;
		}

		// Check if the value is a valid token
		if (value.match(/^[a-fA-F0-9]{64}$/)) {
			// Return true
			return true;
		}

		// Return false
		return false;
	}
}

// Export the class
export default Validate;
