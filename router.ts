class Router {
	// Property: _rootID
	// Type: string
	// Description: The ID of the root element of the application
	private _rootID: string;

	// Property: _rootElement
	// Type: HTMLElement
	// Description: The root element of the application
	private _rootElement: HTMLElement | undefined;

	// Property: _routes
	// Type: Array<{
	// 	route: string;
	// 	component: string;
	// 	default?: boolean;
	// 	title?: string;
	// 	script?: boolean;
	// }>
	// Description: The routes of the application
	private _routes: Array<{
		route: string;
		component: string;
		default?: boolean;
		script?: boolean;
	}>;

	// Property: _routerLinkClass
	// Type: string
	// Description: The class name of router links
	private _routerLinkClass: string;

	// Property: _routesDirectory
	// Type: string
	// Description: The directory of the routes
	private _routesDirectory: string;

	// Property: _currentRoute
	// Type: string
	// Description: The current route
	private _currentRoute: string[];

	// Property: _languages
	// Type: Array<{
	// 	language: string;
	// 	default?: boolean;
	//  image?: string;
	// }> | undefined
	// Description: The languages of the application
	private _languages:
		| Array<{
				language: string;
				default?: boolean;
				image?: string;
		  }>
		| undefined;

	// Property: _languageLinkClass
	// Type: string
	// Description: The class name of language links
	private _languageLinkClass: string | undefined;

	// Property: _languagesDirectory
	// Type: string | undefined
	// Description: The directory of the languages
	private _languagesDirectory: string | undefined;

	// Property: _currentLanguage
	// Type: string | undefined
	// Description: The current language
	private _currentLanguage: string | undefined;

	// Property: _currentLanguageFile
	// Type: string | undefined
	// Description: The current language file
	private _currentLanguageFile:
		| {
				[key: string]: {
					innerHTML?: string;
					ariaLabel?: string;
					src?: string;
					alt?: string;
				};
		  }
		| undefined;

	// Constructor
	// Parameters:
	// - rootID: string
	// - routes: Array<{
	// 	route: string;
	// 	component: string;
	// 	default?: boolean;
	// 	title?: string;
	// 	script?: boolean;
	// }>
	// - routesDirectory: string
	// - languages?: Array<{
	// 	language: string;
	// 	default?: boolean;
	//  image?: string;
	// }>
	// - languagesDirectory?: string
	constructor(
		rootID: string,
		routes: Array<{
			route: string;
			component: string;
			default?: boolean;
			title?: string;
			script?: boolean;
		}>,
		routerLinkClass: string,
		routesDirectory: string,
		languages?: Array<{
			language: string;
			default?: boolean;
			image?: string;
		}>,
		languageLinkClass?: string,
		languagesDirectory?: string
	) {
		// Set the root element ID
		if (rootID) {
			this._rootID = rootID;

			// Set the routes
			if (routes) {
				// Check if there is exactly one default route
				let defaultRouteCount = 0;
				for (let i = 0; i < routes.length; i++) {
					if (routes[i].default) {
						defaultRouteCount++;
					}
				}
				if (defaultRouteCount === 1) {
					this._routes = routes;
				} else {
					throw new Error("Router: There must be exactly one default route.");
				}

				// Set the router link class
				if (routerLinkClass) {
					this._routerLinkClass = routerLinkClass;
				} else {
					throw new Error("Router: The router link class is required.");
				}

				// Set the routes directory
				if (routesDirectory) {
					this._routesDirectory = routesDirectory;
				} else {
					throw new Error("Router: The routes directory is required.");
				}
			} else {
				throw new Error("Router: The routes are required.");
			}

			// Set the languages
			if (languages) {
				// Check if there is exactly one default language
				let defaultLanguageCount = 0;
				for (let i = 0; i < languages.length; i++) {
					if (languages[i].default) {
						defaultLanguageCount++;
					}
				}
				if (defaultLanguageCount === 1) {
					this._languages = languages;
				} else {
					throw new Error("Router: There must be exactly one default language.");
				}

				// Set the language link class
				if (languageLinkClass) {
					this._languageLinkClass = languageLinkClass;
				} else {
					throw new Error("Router: The language link class is required.");
				}

				// Set the languages directory
				if (languagesDirectory) {
					this._languagesDirectory = languagesDirectory;
				} else {
					throw new Error("Router: The languages directory is required.");
				}
			}
		} else {
			throw new Error("Router: The root element ID is required.");
		}

		// Get the current route
		this._currentRoute = this._getRoute();

		if (this._languages) {
			// Get the current language
			this._currentLanguage = this._getLanguage();

			// Set local storage language
			localStorage.setItem("routerPreferredLanguage", this._currentLanguage);
		}

		// Set the current route
		this.setRoute(this._currentRoute.join("/"));

		document.addEventListener("DOMContentLoaded", () => {
			// Add router links
			this._addRouterLinks(document);

			// Add language links
			if (this._languages) {
				this._addLanguageLinks(document);
				this._addAlternateLanguageLinks(document);
			}
		});
	}

	// Method: _getTrimmedPath
	// Description: Gets the trimmed path
	private _getTrimmedPath(): string {
		// Get the path
		let path = window.location.pathname;

		// Trim the path
		path = path.replace(/^\/+|\/+$/g, "");

		// Return the trimmed path
		return path;
	}

	// Method: _getRoute
	// Description: Get the current route
	private _getRoute(): string[] {
		// Get the trimmed path
		let path = this._getTrimmedPath();

		// Split the trimmed path
		let route = path.split("/");

		// If language is set and the first part of the route is a language then remove it
		if (this._languages && this._languages.find((language) => language.language === route[0])) {
			route.shift();
		}

		// If the route length is 0 or the first part of the route is empty then set the default route
		if (route.length === 0 || route[0] === "") {
			route[0] = this._routes.find((route) => route.default)!.route;
		}

		// Return the path split
		return route;
	}

	// Method: _setRoute
	// Description: Set the current route
	public setRoute(routeTo: string): void {
		// If language is set then add it to the route
		if (this._languages) {
			routeTo = this._currentLanguage + "/" + routeTo;
		}

		// Set the route
		window.history.pushState({}, "", "/" + routeTo);

		// Set the current route
		this._currentRoute = this._getRoute();

		if (this._languages) {
			// Update language links
			this._updateLanguageLinks(document);
		}
	}

	// Method: _getLanguage
	// Description: Get the current language
	private _getLanguage(): string {
		if (this._languages) {
			// Get the trimmed path
			let path = this._getTrimmedPath();

			// Split the trimmed path
			let route = path.split("/");

			// If the first part of the route is a supported language then return it
			if (this._languages.find((language) => language.language === route[0])) {
				return route[0];
			}

			// If preferred language is set in local storage and it is a supported language then return it
			if (
				localStorage.getItem("routerPreferredLanguage") &&
				this._languages.find(
					(language) => language.language === localStorage.getItem("routerPreferredLanguage")
				)
			) {
				return localStorage.getItem("routerPreferredLanguage")!;
			} else {
				if (localStorage.getItem("routerPreferredLanguage")) {
					localStorage.removeItem("routerPreferredLanguage");
				}
			}

			// If the browser languages are set and one of them is a supported language then return it
			if (navigator.languages) {
				for (let i = 0; i < navigator.languages.length; i++) {
					if (this._languages.find((language) => language.language === navigator.languages[i])) {
						return navigator.languages[i];
					}
				}
			}

			// Return the default language
			return this._languages.find((language) => language.default)!.language;
		} else {
			throw new Error("Router: Language functionality is not enabled.");
		}
	}

	// Method: _setLanguage
	// Description: Set the current language
	public setLanguage(languageTo: string): void {
		if (this._languages) {
			// If the language is not a supported language then throw an error
			if (!this._languages.find((language) => language.language === languageTo)) {
				throw new Error("Router: The language is not supported.");
			}

			// Set the language
			window.history.pushState({}, "", "/" + languageTo + "/" + this._currentRoute.join("/"));

			// Set the current language
			this._currentLanguage = this._getLanguage();
		} else {
			throw new Error("Router: Language functionality is not enabled.");
		}
	}

	// Method: _addRouterLinks
	// Parameters:
	// - document: The document to add the router links to
	// Description: Add router links to the document
	private _addRouterLinks(document: Document): void {
		// Get all the router links
		let routerLinks = document.querySelectorAll("." + this._routerLinkClass);

		// Loop through all the router links
		routerLinks.forEach((routerLink) => {
			// Add a click event listener to the router link
			routerLink.addEventListener("click", (event) => {
				// Prevent the default behavior
				event.preventDefault();

				// Set the route
				this.setRoute(routerLink.getAttribute("href")!);
			});
		});
	}

	// Method: _addLanguageLinks
	// Parameters:
	// - document: The document to add the language links to
	// Description: Add language links to the document
	private _addLanguageLinks(document: Document): void {
		if (this._languages) {
			// Get all the language links
			let languageLinks = document.querySelectorAll("." + this._languageLinkClass);

			// Get the next language index
			let nextLanguageIndex =
				this._languages.findIndex((language) => language.language === this._currentLanguage) + 1;

			// If the next language index is out of bounds then set it to 0
			if (nextLanguageIndex >= this._languages.length) {
				nextLanguageIndex = 0;
			}

			// Loop through all the language links
			languageLinks.forEach((languageLink) => {
				// Set the language link image if it is set else set the language link text
				if (this._languages) {
					if (this._languages[nextLanguageIndex].image) {
						languageLink.innerHTML = `<img src="${this._languagesDirectory}/ico/${this._languages[nextLanguageIndex].image}" alt="${this._languages[nextLanguageIndex].language}">`;
					} else {
						languageLink.innerHTML = this._languages[nextLanguageIndex].language;
					}

					languageLink.setAttribute(
						"href",
						"/" + this._languages[nextLanguageIndex].language + "/" + this._currentRoute.join("/")
					);
				}
			});
		} else {
			throw new Error("Router: Language functionality is not enabled.");
		}
	}

	// Method: _addAlternateLanguageLinks
	// Parameters:
	// - document: The document to add the alternate language links to
	// Description: Add alternate language links to the document
	private _addAlternateLanguageLinks(document: Document): void {
		if (this._languages) {
			// Setup alternate language links in head
			this._languages.forEach((language) => {
				if (language.language !== this._currentLanguage) {
					let alternateLanguageLink = document.createElement("link");
					alternateLanguageLink.classList.add("routerAlternateLanguageLink");
					alternateLanguageLink.setAttribute("rel", "alternate");
					alternateLanguageLink.setAttribute("hreflang", language.language);
					alternateLanguageLink.setAttribute(
						"href",
						window.location.origin + "/" + language.language + "/" + this._currentRoute.join("/")
					);
					document.head.appendChild(alternateLanguageLink);
				}
			});
		} else {
			throw new Error("Router: Language functionality is not enabled.");
		}
	}

	// Method: _updateLanguageLinks
	// Parameters:
	// - document: The document to update the language links and alternate language links in
	// Description: Update the href of the language links and alternate language links in the document
	private _updateLanguageLinks(document: Document): void {
		if (this._languages) {
			// Get all the language links
			let languageLinks = document.querySelectorAll("." + this._languageLinkClass);

			// Get the next language index
			let nextLanguageIndex =
				this._languages.findIndex((language) => language.language === this._currentLanguage) + 1;

			// If the next language index is out of bounds then set it to 0
			if (nextLanguageIndex >= this._languages.length) {
				nextLanguageIndex = 0;
			}

			// Loop through all the language links
			languageLinks.forEach((languageLink) => {
				if (this._languages) {
					// Set the language link href
					languageLink.setAttribute(
						"href",
						"/" + this._languages[nextLanguageIndex].language + "/" + this._currentRoute.join("/")
					);
				}
			});

			// Remove all the alternate language links
			let alternateLanguageLinks = document.querySelectorAll(".routerAlternateLanguageLink");
			alternateLanguageLinks.forEach((alternateLanguageLink) => {
				alternateLanguageLink.remove();
			});

			// Add the alternate language links
			this._addAlternateLanguageLinks(document);
		} else {
			throw new Error("Router: Language functionality is not enabled.");
		}
	}

	// Method: _matchRoute
	// Parameters:
	// - route: The route to match
	// Description: Match the route to the routes and return the matched route and parameters
	private _matchRoute(route: string): {
		route: { route: string; component: string; default?: boolean; script?: boolean };
		parameters: { [key: string]: string };
	} {
		// Split the route into parts
		let routeParts = route.split("/");
	}

	// Method: _fetchPage
	// Parameters:
	// - route: The route to fetch the page for
	// Description: Fetch the page for the route

	// Method: _translatePage
	// Parameters:
	// - page: The page to translate
	// Description: Translate the page

	// Method: _processPage
	// Parameters:
	// - route: The route to process the page for
	// - page: The page to process
	// Description: Process the page for the route

	// Method: _displayPage
	// Parameters:
	// - route: The route to display the page for
	// - page: The page to display
	// Description: Display the page for the route
}

let router = new Router(
	"root",
	[
		{
			route: "home",
			component: "home",
			default: true,
			script: true,
		},
	],
	"routerLink",
	"/routes",
	[
		{
			language: "da",
			default: true,
			image: "da.svg",
		},
		{
			language: "en",
			image: "en.svg",
		},
	],
	"languageLink",
	"/assets/lang"
);
