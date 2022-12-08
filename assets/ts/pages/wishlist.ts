// Import modules
import Wishlist from "../wishlist.js";
import Wish from "../wish.js";

// Get all elements
const wishes = document.getElementById("wishes");
const wishModal = document.getElementById("modal");
const wishForm = document.getElementById("wishForm");
const closeBtn = document.getElementById("close");
const createBtn = document.getElementById("create");
const deleteBtn = document.getElementById("delete");

// Create a new wishlist api instance
const wishlistApi = new Wishlist.Api();

// Create a new wish api instance
const wishApi = new Wish.Api();

// Create a new wish elements instance
const wishElements = new Wish.Elements();

// Get url parameters
const urlParams = new URLSearchParams(window.location.search);

// Get the wishlist details with the id from the url
const wishlistId = Number(urlParams.get("id"));
if (wishlistId) {
	wishlistApi
		.get(wishlistId)
		.then((response) => {
			// Check if the response is successful
			if (response.status === 200) {
				// Replace "Ønskeliste" with the wishlist name in all changeTitle elements
				const changeTitleElements = document.querySelectorAll(".changeTitle");
				changeTitleElements.forEach((element) => {
					element.innerHTML = element.innerHTML.replace("Ønskeliste", response.data.wishlist_name);
				});

				// Fetch all wishes
				wishApi.getAll(wishlistId).then((response) => {
					if (wishes && wishModal) wishElements.createList(wishes, response.data, wishModal);
				});
			}
		})
		.catch((error) => {
			// Redirect to the overview page
			window.location.href = "./overview.html";
		});
}

// Add event listener to the wish form
if (wishForm)
	wishForm.addEventListener("submit", (event) => {
		// Prevent the default form action
		event.preventDefault();

		// Validate the form
		const valid = wishElements.validateForm(wishForm as HTMLFormElement);

		// Check if the form is valid
		if (valid) {
			// Get the form data
			const formData = new FormData(wishForm as HTMLFormElement);

			// Convert the form data to a json object
			const data = Object.fromEntries(formData);

			console.log(data);

			// Check if the wish id is set
			if (data.wishId) {
				console.log("Update wish");

				// Update the wish
				wishApi
					.update(
						Number(data.wishlistId),
						Number(data.wishId),
						String(data.wishName),
						Number(data.wishPrice),
						String(data.wishLink)
					)
					.then((response) => {
						// Check if the response is successful
						if (response.status === 200) {
							// Refresh the page
							window.location.reload();
						}
					});
			} else {
				console.log("Create wish");

				// Create a new wish
				wishApi
					.create(
						Number(data.wishlistId),
						String(data.wishName),
						Number(data.wishPrice),
						String(data.wishLink)
					)
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

// Add event listener to close button
if (closeBtn)
	closeBtn.addEventListener("click", () => {
		// Close the modal
		if (wishModal) wishElements.closeForm(wishModal);
	});

// Add event listener to create button
if (createBtn)
	createBtn.addEventListener("click", () => {
		// Open the modal
		if (wishModal) wishElements.openForm(wishModal, wishlistId);
	});

// Add event listener to delete button
if (deleteBtn)
	deleteBtn.addEventListener("click", (event) => {
		// Get the id from the delete button
		const button = event.target as HTMLButtonElement;
		const id = button.dataset.id;

		// Check if the id is set
		if (id) {
			// Delete the wish
			wishApi.delete(wishlistId, Number(id)).then((response) => {
				// Check if the response is successful
				if (response.status === 200) {
					// Refresh the page
					window.location.reload();
				}
			});
		}
	});
