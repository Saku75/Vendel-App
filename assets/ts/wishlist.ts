import Validate from "./validate.js";

/*
	Endpoints:
		- GET /wishlists - Get all wishlists
		- GET /wishlists/:wishlist_id - Get a wishlist
		- POST /wishlists - Create a wishlist
		- PUT /wishlists/:wishlist_id - Update a wishlist
		- DELETE /wishlists/:wishlist_id - Delete a wishlist
*/

/*
	Namespace: Wishlist
	Description: The Wishlist namespace, which contains all the methods for the wishlist page.
*/
namespace Wishlist {
	/*
		Property: apiEndpoint
		Description: The api endpoint.
	*/
	const apiEndpoint: string = "http://127.0.0.1:5000/";

	/*
		Interface: WishlistItem
		Description: Defines the wishlist interface.
	*/
	export interface WishlistItem {
		wishlist_id: number;
		wishlist_name: string;
		wishlist_date: string;
		wishlist_last_updated: string;
	}

	/*
		Class: Api
		Description: The Api class, which contains all the methods for the wishlist api.
	*/
	export class Api {
		/*
			Method: getAll
			Description: Gets all wishlists.
		*/
		public async getAll(): Promise<any | undefined> {
			// Fetch all wishlists
			const response = await fetch(`${apiEndpoint}wishlists`);

			// Check if the response is ok
			if (response.ok) {
				// Return the response as json
				return response.json();
			}

			return undefined;
		}

		/*
			Method: get
			Description: Gets a wishlist.
			Parameters:
				- id: number - The id of the wishlist.
		*/
		public async get(id: number): Promise<any | undefined> {
			// Fetch the wishlist
			const response = await fetch(`${apiEndpoint}wishlists/${id}`);

			// Check if the response is ok
			if (response.ok) {
				// Return the response as json
				return response.json();
			}

			return undefined;
		}

		/*
			Method: create
			Description: Creates a wishlist.
			Parameters:
				- name: string - The name of the wishlist.
				- date: string - The date of the wishlist.
		*/
		public async create(name: string, date: string): Promise<any | undefined> {
			// Create a new wishlist
			const response = await fetch(`${apiEndpoint}wishlists`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					wishlist_name: name,
					wishlist_date: date,
				}),
			});

			// Check if the response is ok
			if (response.ok) {
				// Return the response as json
				return response.json();
			}

			return undefined;
		}

		/*
			Method: update
			Description: Updates a wishlist.
			Parameters:
				- id: number - The id of the wishlist.
				- name: string - The name of the wishlist.
				- date: string - The date of the wishlist.
		*/
		public async update(id: number, name: string, date: string): Promise<any | undefined> {
			// Update the wishlist
			const response = await fetch(`${apiEndpoint}wishlists/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					wishlist_name: name,
					wishlist_date: date,
				}),
			});

			// Check if the response is ok
			if (response.ok) {
				// Return the response as json
				return response.json();
			}

			return undefined;
		}

		/*
			Method: delete
			Description: Deletes a wishlist.
			Parameters:
				- id: number - The id of the wishlist.
		*/
		public async delete(id: number): Promise<any | undefined> {
			// Delete the wishlist
			const response = await fetch(`${apiEndpoint}wishlists/${id}`, {
				method: "DELETE",
			});

			// Check if the response is ok
			if (response.ok) {
				// Return the response as json
				return response.json();
			}

			return undefined;
		}
	}

	/*
		Class: Elements
		Description: The Elements class, which contains all the methods for creating and controlling the wishlist elements.
	*/
	export class Elements {
		/*
			Method: createList
			Description: Creates a list of wishlists.
			Parameters:
				- container: HTMLElement - The container to create the list in.
				- wishlists: WishlistItem[] - The wishlists to create a list of.
				- formContainer: HTMLElement - The container that holds the form.
		*/
		public createList(
			container: HTMLElement,
			wishlists: WishlistItem[],
			formContainer: HTMLElement
		): void {
			// Empty the wishlists
			container.innerHTML = "";

			// Loop through the wishlists
			wishlists.forEach((wishlist: WishlistItem) => {
				// Create a new list item
				const wishlistItem = document.createElement("li");

				// Create a new button
				const wishlistEdit = document.createElement("button");
				wishlistEdit.classList.add("iconMD");
				wishlistEdit.innerText = "settings";
				wishlistEdit.ariaLabel = "Rediger ønskeliste";
				wishlistEdit.dataset.id = String(wishlist.wishlist_id);
				wishlistEdit.addEventListener("click", (event: Event) => {
					// Get the id of the wishlist
					const id = Number((event.target as HTMLElement).dataset.id);

					// Open form
					this.openForm(formContainer, id);
				});

				// Create a new link
				const wishlistLink = document.createElement("a");
				wishlistLink.href = `wishlist.html?id=${wishlist.wishlist_id}`;
				wishlistLink.innerHTML = `
				<span class="date" aria-label="Dato for ønskeliste">
					${new Date(wishlist.wishlist_date).toLocaleString("da", { day: "numeric", month: "long" })}
				</span>
				<h3>${wishlist.wishlist_name}</h3>
				<span class="lastUpdated">
					Sidst opdateret:
					${new Date(wishlist.wishlist_last_updated).toLocaleString("da", {
						day: "numeric",
						month: "long",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				</span>
				`;

				// Append the button to the list item
				wishlistItem.appendChild(wishlistEdit);

				// Append the link to the list item
				wishlistItem.appendChild(wishlistLink);

				// Append the list item to the list
				container.appendChild(wishlistItem);
			});
		}

		/*
			Method: openForm
			Description: Opens the form for creating or editing a wishlist.
			Parameters:
				- container: HTMLElement - The container to create the form in.
				- wishlist_id: number | undefined - The id of the wishlist to edit, or undefined if creating a new wishlist.
		*/
		public async openForm(container: HTMLElement, wishlist_id?: number): Promise<void> {
			// Remove hidden class from the container
			container.classList.remove("hidden");

			// Query delete button
			const deleteButton = container.querySelector("#delete") as HTMLButtonElement;

			// Query submit button
			const submitButton = container.querySelector("#submit") as HTMLButtonElement;

			// Query the form and form inputs
			const form = container.querySelector("form") as HTMLFormElement;
			const nameInput = form.querySelector("#wishlistName") as HTMLInputElement;
			const dateInput = form.querySelector("#wishlistDate") as HTMLInputElement;

			// Set date input value to today
			dateInput.value = new Date().toISOString().split("T")[0];

			// If the wishlist id is set, get the wishlist from the API
			const wishlistData = wishlist_id ? await new Api().get(wishlist_id) : undefined;

			// If wishlist data is set, remove the hidden class from the delete button and set the values of the form
			if (wishlistData) {
				deleteButton.classList.remove("hidden");
				deleteButton.dataset.id = String(wishlistData.data.wishlist_id);

				nameInput.value = wishlistData.data.wishlist_name;
				dateInput.value = new Date(wishlistData.data.wishlist_date).toISOString().split("T")[0];

				// Add a hidden input with the wishlist id
				const idInput = document.createElement("input");
				idInput.type = "hidden";
				idInput.name = "wishlistId";
				idInput.value = String(wishlistData.data.wishlist_id);
				form.appendChild(idInput);

				// Change the text of the submit button
				submitButton.innerHTML = '<span class="iconMD"> save </span>Gem';
			} else if (wishlist_id && !wishlistData) {
				window.location.reload();
			}
		}

		/*
			Method: closeForm
			Description: Closes the form and clears the values.
			Parameters:
				- container: HTMLElement - The container to close the form in.
		*/
		public closeForm(container: HTMLElement): void {
			// Add hidden class to the container
			container.classList.add("hidden");

			// Query all label elements
			const labels = container.querySelectorAll("label") as NodeListOf<HTMLLabelElement>;

			// Remove the error class from all labels
			labels.forEach((label) => {
				label.classList.remove("error");
			});

			// Query delete button
			const deleteButton = container.querySelector("#delete") as HTMLButtonElement;

			// Query submit button
			const submitButton = container.querySelector("#submit") as HTMLButtonElement;

			// Query the form
			const form = container.querySelector("form") as HTMLFormElement;

			// Reset form inputs and remove the hidden input
			form.reset();

			// Remove the hidden input
			const idInput = form.querySelector("input[type=hidden]") as HTMLInputElement;
			if (idInput) {
				idInput.remove();
			}

			// Add hidden class to the delete button
			deleteButton.classList.add("hidden");
			deleteButton.removeAttribute("data-id");

			// Change the text of the submit button
			submitButton.innerHTML = '<span class="iconMD"> add </span>Opret';
		}

		/*
			Method: validateForm
			Description: Validates the form and outputs errors to errorMessages.
			Parameters:
				- form: HTMLFormElement - The form to validate.
		*/
		public validateForm(form: HTMLFormElement): boolean {
			// Create Validate instance
			const validate = new Validate();

			// Query all label elements
			const labels = form.querySelectorAll("label");

			// Declare valid variable
			let valid = true;

			// Loop through the labels
			labels.forEach((label: HTMLElement) => {
				// Get the input element
				const input = label.querySelector("input") as HTMLInputElement;

				// Get the error message element
				const errorMessage = label.querySelector(".errorMessage") as HTMLElement;

				// If the input is required and empty, add error class and set valid to false
				if (input.required && input.value === "") {
					label.classList.add("error");

					// Set valid to false
					valid = false;

					// Output error message
					errorMessage.innerHTML = "Dette felt skal udfyldes.";

					return;
				} else {
					label.classList.remove("error");

					// Clear error message
					errorMessage.innerHTML = "";
				}

				switch (input.dataset.type) {
					case "date":
						// If the input is a date and the value is not a valid date, add error class
						if (!validate.date(input.value)) {
							label.classList.add("error");

							// Set valid to false
							valid = false;

							// Output error message
							errorMessage.innerHTML = "Datoen er ikke gyldig.";
						} else {
							label.classList.remove("error");

							// Clear error message
							errorMessage.innerHTML = "";
						}
						break;
					case "name":
						// If the input is a name and the value is not a valid name, add error class
						if (!validate.name(input.value)) {
							label.classList.add("error");

							// Set valid to false
							valid = false;

							// Output error message
							errorMessage.innerHTML = "Navnet er ikke gyldigt.";
						} else {
							label.classList.remove("error");

							// Clear error message
							errorMessage.innerHTML = "";
						}
						break;
				}
			});

			// Return valid
			return valid;
		}
	}
}

// Export the wishlist namespace
export default Wishlist;
