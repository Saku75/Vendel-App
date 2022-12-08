import Validate from "./validate.js";

/*
	Endpoints:
		- GET /wishlists/:wishlist_id/wishes - Get all wishes from a wishlist
		- GET /wishlists/:wishlist_id/wishes/:wish_id - Get a wish
		- POST /wishlists/:wishlist_id/wishes - Create a wish
		- PUT /wishlists/:wishlist_id/wishes/:wish_id - Update a wish
		- DELETE /wishlists/:wishlist_id/wishes/:wish_id - Delete a wish
*/

/*
	Namespace: Wish
	Description: The Wish namespace, which contains all the methods for the wish api.
*/
namespace Wish {
	/*
		Property: apiEndpoint
		Description: The api endpoint.
	*/
	const apiEndpoint: string = "http://127.0.0.1:5000/";

	/*
		Interface: WishItem
		Description: Defines the wish interface.
	*/
	export interface WishItem {
		wish_id: number;
		wishlist_id: number;
		wish_name: string;
		wish_price: number;
		wish_link: string;
		wish_last_updated: string;
	}

	/*
		Class: Api
		Description: The Api class, which contains all the methods for the wish api.
	*/
	export class Api {
		/*
			Method: getAll
			Description: Gets all wishes from a wishlist.
			Parameters:
				- wishlist_id: number - The id of the wishlist to get the wishes from.
		*/
		public async getAll(wishlist_id: number): Promise<any | undefined> {
			// Fetch the wishes
			const response = await fetch(`${apiEndpoint}wishlists/${wishlist_id}/wishes`);

			// Check if the response is ok
			if (response.ok) {
				// Return the wishes
				return await response.json();
			}

			return undefined;
		}

		/*
			Method: get
			Description: Gets a wish.
			Parameters:
				- wishlist_id: number - The id of the wishlist to get the wish from.
				- wish_id: number - The id of the wish to get.
		*/
		public async get(wishlist_id: number, wish_id: number): Promise<any | undefined> {
			// Fetch the wish
			const response = await fetch(`${apiEndpoint}wishlists/${wishlist_id}/wishes/${wish_id}`);

			// Check if the response is ok
			if (response.ok) {
				// Return the wish
				return await response.json();
			}

			return undefined;
		}

		/*
			Method: create
			Description: Creates a wish.
			Parameters:
				- wishlist_id: number - The id of the wishlist to create the wish in.
				- wish_name: string - The name of the wish.
				- wish_price: number - The price of the wish.
				- wish_link: string - The link to the wish.
		*/
		public async create(
			wishlist_id: number,
			wish_name: string,
			wish_price: number,
			wish_link: string
		): Promise<any | undefined> {
			// Create the wish
			const response = await fetch(`${apiEndpoint}wishlists/${wishlist_id}/wishes`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					wish_name: wish_name,
					wish_price: wish_price,
					wish_link: wish_link,
				}),
			});

			// Check if the response is ok
			if (response.ok) {
				// Return the wish
				return await response.json();
			}

			return undefined;
		}

		/*
			Method: update
			Description: Updates a wish.
			Parameters:
				- wishlist_id: number - The id of the wishlist to update the wish in.
				- wish_id: number - The id of the wish to update.
				- wish_name: string - The name of the wish.
				- wish_price: number - The price of the wish.
				- wish_link: string - The link to the wish.
		*/
		public async update(
			wishlist_id: number,
			wish_id: number,
			wish_name: string,
			wish_price: number,
			wish_link: string
		): Promise<any | undefined> {
			// Update the wish
			const response = await fetch(`${apiEndpoint}wishlists/${wishlist_id}/wishes/${wish_id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					wish_name: wish_name,
					wish_price: wish_price,
					wish_link: wish_link,
				}),
			});

			// Check if the response is ok
			if (response.ok) {
				// Return the wish
				return await response.json();
			}

			return undefined;
		}

		/*
			Method: delete
			Description: Deletes a wish.
			Parameters:
				- wishlist_id: number - The id of the wishlist to delete the wish from.
				- wish_id: number - The id of the wish to delete.
		*/
		public async delete(wishlist_id: number, wish_id: number): Promise<any | undefined> {
			// Delete the wish
			const response = await fetch(`${apiEndpoint}wishlists/${wishlist_id}/wishes/${wish_id}`, {
				method: "DELETE",
			});

			// Check if the response is ok
			if (response.ok) {
				// Return the wish
				return await response.json();
			}

			return undefined;
		}
	}

	/*
		Class: Elements
		Description: The Elements class, which contains all the methods for creating and controlling the wish elements.
	*/
	export class Elements {
		/*
			Method: createList
			Description: Creates a list of wishes.
			Parameters:
				- container: HTMLElement - The container to create the list in.
				- wishes: WishItem[] - The wishes to create the list from.
				- formContainer: HTMLElement - The container that holds the form.
		*/
		public createList(
			container: HTMLElement,
			wishes: WishItem[],
			formContainer: HTMLElement
		): void {
			// Empty the container
			container.innerHTML = "";

			// Loop through the wishes
			wishes.forEach((wish: WishItem) => {
				// Create a new list item
				const wishItem = document.createElement("li");

				// Create a new button
				const wishEdit = document.createElement("button");
				wishEdit.classList.add("iconMD");
				wishEdit.innerText = "settings";
				wishEdit.ariaLabel = "Rediger ønske";
				wishEdit.dataset.id = String(wish.wish_id);
				wishEdit.addEventListener("click", (event: Event) => {
					// Get the id of the wishlist
					const id = Number((event.target as HTMLElement).dataset.id);

					// Get the id parameter from the url
					const urlParams = new URLSearchParams(window.location.search);
					const wishlist_id = Number(urlParams.get("id"));

					// Open form
					this.openForm(formContainer, wishlist_id, id);
				});

				// Create a new link
				const wishLink = document.createElement("a");
				wishLink.href = wish.wish_link;
				wishLink.target = "_blank";
				wishLink.innerHTML = `
				<h3>${wish.wish_name}</h3>
				<span class="price" aria-label="Pris på ønske">${Math.floor(wish.wish_price)} kr.</span>
				<span class="lastUpdated">
					Sidst opdateret:
					${new Date(wish.wish_last_updated).toLocaleString("da", {
						day: "numeric",
						month: "long",
						year: "numeric",
						hour: "numeric",
						minute: "numeric",
					})}
				</span>
				`;

				// Append the elements
				wishItem.appendChild(wishEdit);
				wishItem.appendChild(wishLink);
				container.appendChild(wishItem);
			});
		}

		/*
			Method: openForm
			Description: Opens the form for creating or editing a wish.
			Parameters:
				- container: HTMLElement - The container that holds the form.
				- wishlist_id: number - The id of the wishlist to create the wish in.
				- wish_id: number - The id of the wish to edit.
		*/
		public async openForm(
			container: HTMLElement,
			wishlist_id: number,
			wish_id?: number
		): Promise<void> {
			// Remove hidden class from the container
			container.classList.remove("hidden");

			// Query delete button
			const deleteButton = container.querySelector("#delete") as HTMLButtonElement;

			// Query submit button
			const submitButton = container.querySelector("#submit") as HTMLButtonElement;

			// Query the form and form inputs
			const form = container.querySelector("form") as HTMLFormElement;
			const nameInput = form.querySelector("#wishName") as HTMLInputElement;
			const priceInput = form.querySelector("#wishPrice") as HTMLInputElement;
			const linkInput = form.querySelector("#wishLink") as HTMLInputElement;
			const wishlistIdInput = form.querySelector("#wishlistId") as HTMLInputElement;

			// Set the wishlist id
			wishlistIdInput.value = String(wishlist_id);

			// If the wish id is defined, get the wish from the API
			const wishData = wish_id ? await new Api().get(wishlist_id, wish_id) : undefined;

			// If the wish data is defined, set the form values and show the delete button
			if (wishData) {
				deleteButton.classList.remove("hidden");
				deleteButton.dataset.id = String(wishData.data.wish_id);

				nameInput.value = wishData.data.wish_name;
				priceInput.value = String(wishData.data.wish_price);
				linkInput.value = wishData.data.wish_link;

				// Add a hidden input with the wish id
				const wishIdInput = document.createElement("input");
				wishIdInput.type = "hidden";
				wishIdInput.name = "wishId";
				wishIdInput.value = String(wishData.data.wish_id);
				form.appendChild(wishIdInput);

				// Change the text of the submit button
				submitButton.innerHTML = '<span class="iconMD"> save </span>Gem';
			} else if (wish_id && !wishData) {
				window.location.reload();
			}
		}

		/*
			Method: closeForm
			Description: Closes the form for creating or editing a wish.
			Parameters:
				- container: HTMLElement - The container that holds the form.
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

			// Query the form and form inputs
			const form = container.querySelector("form") as HTMLFormElement;

			// Reset the form
			form.reset();

			// Hide the delete button
			deleteButton.classList.add("hidden");

			// Remove the wish id input
			const wishIdInput = form.querySelector("input[name=wishId]") as HTMLInputElement;
			if (wishIdInput) {
				wishIdInput.remove();
			}

			// Change the text of the submit button
			const submitButton = container.querySelector("#submit") as HTMLButtonElement;
			submitButton.innerHTML = '<span class="iconMD"> add </span>Opret';
		}

		/*
			Method: validateForm
			Description: Validates the form for creating or editing a wish.
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

			// Loop through all labels
			labels.forEach((label) => {
				// Get the input element
				const input = label.querySelector("input") as HTMLInputElement;

				// Get the error message element
				const errorMessage = label.querySelector(".errorMessage") as HTMLElement;

				// If the input is required and empty, add error class and set valid to false
				if (input.required && input.value === "") {
					label.classList.add("error");
					errorMessage.innerHTML = "Dette felt skal udfyldes.";
					valid = false;
					return;
				} else {
					label.classList.remove("error");
					errorMessage.innerHTML = "";
				}

				switch (input.dataset.type) {
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
					case "price":
						// If the input is a price and the value is not a valid price, add error class
						if (!validate.number(input.value)) {
							label.classList.add("error");

							// Set valid to false
							valid = false;

							// Output error message
							errorMessage.innerHTML = "Prisen er ikke gyldig.";
						} else {
							label.classList.remove("error");

							// Clear error message
							errorMessage.innerHTML = "";
						}
						break;
					case "link":
						// If the input is a link and the value is not a valid link, add error class
						if (!validate.link(input.value)) {
							label.classList.add("error");

							// Set valid to false
							valid = false;

							// Output error message
							errorMessage.innerHTML = "Linket er ikke gyldigt.";
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
export default Wish;
