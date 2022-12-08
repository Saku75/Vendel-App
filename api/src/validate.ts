/*
	Class: Validate
	Description: The Validate class, which contains all the methods for validating data.
*/
class Validate {
	/*
		Method: number
		Description: Validates an number or a string that can be converted to a number.
		Parameters:
			- value: string
	*/
	public number(value: string): boolean {
		// Check if the value is a not a number
		if (typeof value !== "number") {
			// Check if the value is a not a string
			if (typeof value !== "string") {
				// Return false
				return false;
			}

			// Check if the value is empty
			if (value.length === 0) {
				// Return false
				return false;
			}

			// Check if the value is a number
			if (isNaN(Number(value))) {
				// Return false
				return false;
			}
		}

		// Return true
		return true;
	}

	/*
		Method: name
		Description: Validates a name, which is a string.
		Parameters:
			- value: string
	*/
	public name(value: string): boolean {
		// Check if the value is a not a string
		if (typeof value !== "string") {
			// Return false
			return false;
		}

		// Check if the value is empty
		if (value.length === 0) {
			// Return false
			return false;
		}

		// Check if the value contains sql or html characters
		if (/['";<>]/.test(value)) {
			// Return false
			return false;
		}

		// Return true
		return true;
	}

	/*
		Method: date
		Description: Validates a date string, making sure it is sql compatible.
		Parameters:
			- value: string
	*/
	public date(value: string): boolean {
		// Check if the value is a not a string
		if (typeof value !== "string") {
			// Return false
			return false;
		}

		// Check if the value is empty
		if (value.length === 0) {
			// Return false
			return false;
		}

		// Check if the value contains sql or html characters
		if (/['";<>]/.test(value)) {
			// Return false
			return false;
		}

		// Check if the value is a valid date
		if (isNaN(Date.parse(value))) {
			// Return false
			return false;
		}

		// Return true
		return true;
	}
}

// Export the class
export default Validate;
