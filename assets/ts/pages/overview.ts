// Import modules
import Wishlist from "../wishlist.js";

// Get all elements
const wishlists = document.getElementById("wishlists");
const wishlistModal = document.getElementById("modal");
const wishlistForm = document.getElementById("wishlistForm");
const closeBtn = document.getElementById("close");
const createBtn = document.getElementById("create");
const deleteBtn = document.getElementById("delete");

// Create a new wishlist api instance
const wishlistApi = new Wishlist.Api();

// Create a new wishlist elements instance
const wishlistElements = new Wishlist.Elements();

// Fetch all wishlists
wishlistApi.getAll().then((response) => {
	if (wishlists && wishlistModal)
		wishlistElements.createList(wishlists, response.data, wishlistModal);
});

// Add event listener to the wishlist form
if (wishlistForm)
	wishlistForm.addEventListener("submit", (event) => {
		// Prevent the default form action
		event.preventDefault();

		// Validate the form
		const valid = wishlistElements.validateForm(wishlistForm as HTMLFormElement);

		// Use the validateForm function to validate the form
		if (valid) {
			// Get the form data
			const formData = new FormData(wishlistForm as HTMLFormElement);

			// Convert the form data to a json object
			const data = Object.fromEntries(formData);

			console.log(data);

			// Check if the id is set
			if (data.wishlistId) {
				console.log("Update wishlist");

				// Update the wishlist
				wishlistApi
					.update(Number(data.wishlistId), String(data.wishlistName), String(data.wishlistDate))
					.then((response) => {
						// Check if the response is successful
						if (response.status === 200) {
							// Refresh the page
							window.location.reload();
						}
					});
			} else {
				console.log("Create wishlist");

				// Create a new wishlist
				wishlistApi
					.create(String(data.wishlistName), String(data.wishlistDate))
					.then((response) => {
						// Check if the response is successful
						if (response.status === 201) {
							// Refresh the page
							window.location.reload();
						}
					});
			}
		}
	});

// Add event listener to the close button
if (closeBtn)
	closeBtn.addEventListener("click", () => {
		if (wishlistModal) wishlistElements.closeForm(wishlistModal);
	});

// Add event listener to the create button
if (createBtn)
	createBtn.addEventListener("click", () => {
		if (wishlistModal) wishlistElements.openForm(wishlistModal, undefined);
	});

// Add event listener to the delete button
if (deleteBtn)
	deleteBtn.addEventListener("click", (event) => {
		// Get the id from the button
		const button = event.target as HTMLElement;
		const id = button.dataset.id;

		// Check if the id is set
		if (id) {
			// Delete the wishlist
			wishlistApi.delete(Number(id)).then((response) => {
				// Check if the response is successful
				if (response.status === 200) {
					// Refresh the page
					window.location.reload();
				}
			});
		}
	});
