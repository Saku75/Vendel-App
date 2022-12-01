class Router {
	// Property: _rootElementID
	// The ID of the root element of the router
	private _rootElementID: string;

	// Property: _rootElement
	// The root element of the router
	private _rootElement: HTMLElement | null = null;

	// Property: _routerLinkClass
	// The router link class of the router
	private _routerLinkClass: string;

	// Property: _routerLinks
	// The router links of the router
	private _routerLinks: NodeListOf<HTMLElement> | null = null;

	// Property: _languageLinkClass
	// The language link class of the router
	private _languageLinkClass: string | undefined;

	// Property: _languageLinks
	// The language links of the router
	private _languageLinks: NodeListOf<HTMLElement> | null = null;

	// Property: _routes
	// The routes of the router
	private _routes: Array<{ route: string; component: string; script?: boolean }>;

	// Property: _defaultRoute
	// The default route of the router
	private _defaultRoute: string;

	// Property: _currentRoute
	// The current route of the router
	private _currentRoute: string[];

	// Property: _routesFolder
	// The folder of the routes
	private _routesFolder = "/routes";

	// Property: _languages
	// The languages of the router
	private _languages: Array<{ language: string; image: string }> | undefined;

	// Property: _defaultLanguage
	// The default language of the router
	private _defaultLanguage: string | undefined;

	// Property: _currentLanguage
	// The current language of the router
	private _currentLanguage: string | undefined;

	// Property: _languagesFolder
	// The folder of the languages
	private _languagesFolder = "/languages";

	// Property: _languageFile
	// The language file of the current language
	private _languageFile:
		| { [key: string]: { content?: string; ariaLabel?: string; alt?: string } }
		| undefined;

	// Constructor
	// Parameters:
	// rootElementID - The ID of the root element
	// routes - The routes of the router
	// defaultRoute - The default route of the router
	// routerLinkClass - The router link class of the router
	// routesFolder - The folder of the routes
	// languages? - The languages of the router
	// defaultLanguage? - The default language of the router
	// languageLinkClass? - The language link class of the router
	// languagesFolder? - The folder of the languages
	constructor(
		rootElementID: string,
		routes: Array<{ route: string; component: string; script?: boolean }>,
		defaultRoute: string,
		routerLinkClass: string,
		routesFolder?: string,
		languages?: Array<{ language: string; image: string }>,
		defaultLanguage?: string,
		languageLinkClass?: string,
		languagesFolder?: string
	) {
		if (!rootElementID) {
			throw new Error("The root element ID is required.");
		} else {
			this._rootElementID = rootElementID;
		}

		if (!routes) {
			throw new Error("The routes are required.");
		} else {
			this._routes = routes;
		}

		if (!defaultRoute) {
			throw new Error("The default route is required.");
		} else {
			this._defaultRoute = defaultRoute;
		}

		if (!routerLinkClass) {
			throw new Error("The router link class is required.");
		} else {
			this._routerLinkClass = routerLinkClass;
		}

		if (routesFolder) {
			this._routesFolder = routesFolder;
		}

		if (languages) {
			this._languages = languages;

			if (!defaultLanguage) {
				throw new Error("The default language is required.");
			} else {
				this._defaultLanguage = defaultLanguage;
			}

			if (!languageLinkClass) {
				throw new Error("The language link class is required.");
			} else {
				this._languageLinkClass = languageLinkClass;
			}

			if (languagesFolder) {
				this._languagesFolder = languagesFolder;
			}
		}

		this._currentRoute = this._getRoute();

		if (this._languages) {
			this._currentLanguage = this._getLanguage();

			if (!this._currentLanguage) {
				this._currentLanguage = localStorage.siteLanguage;

				if (!this._currentLanguage) {
					this._currentLanguage = this._getPreferredLanguage();
				}

				if (this._currentLanguage) {
					this._setLanguage(this._currentLanguage);
				}
			}

			localStorage.siteLanguage = this._currentLanguage;
		}

		document.addEventListener("DOMContentLoaded", () => {
			this._rootElement = document.getElementById(this._rootElementID);

			if (this._routerLinkClass) {
				this._routerLinks = document.querySelectorAll(`.${this._routerLinkClass}`);
				if (this._routerLinks) {
					this._setupRouterLinks(this._routerLinks);
				}
			}

			if (this._languages) {
				this._getLanguageFile().then((languageFile) => {
					this._languageFile = languageFile;
					console.log(this._languageFile);
					const languageElements = document.querySelectorAll("[data-lang-id]");

					if (languageElements) {
						this._translate(languageElements);
					}
				});

				if (this._currentLanguage) {
					document.documentElement.lang = this._currentLanguage;
				}

				if (this._languageLinkClass) {
					this._languageLinks = document.querySelectorAll(`.${this._languageLinkClass}`);
					if (this._languageLinks) {
						this._setupLanguageLinks(this._languageLinks);
					}
				}
			}
		});

		// ...
	}

	// Method: _getTrimmedPath
	// Gets the trimmed path
	// Returns:
	// The trimmed path
	private _getTrimmedPath(): string {
		let path = window.location.pathname;

		path = path.replace(/^\/+|\/+$/g, "");

		return path;
	}

	// Method: _setupLanguageLinks
	// Sets up the language links
	// Parameters:
	// languageLinks - The language links
	private _setupLanguageLinks(links: NodeListOf<Element>): void {
		if (this._languages) {
			// Get next language index
			let nextLanguageIndex =
				this._languages.findIndex((language) => language.language === this._currentLanguage) + 1;

			// If next language index is greater than the languages length
			if (nextLanguageIndex > this._languages.length - 1) {
				// Set next language index to 0
				nextLanguageIndex = 0;
			}

			// Get next language
			const nextLanguage = this._languages[nextLanguageIndex];

			if (links) {
				links.forEach((link) => {
					link.innerHTML = `<img src="${this._languagesFolder}/ico/${nextLanguage.image}" alt="${nextLanguage.language}" />`;
					link.setAttribute("href", `/${nextLanguage.language}/${this._currentRoute.join("/")}`);
				});
			}

			// Delete all alternate links
			const alternateLinks = document.querySelectorAll(".alternateLink");
			if (alternateLinks) {
				alternateLinks.forEach((alternateLink) => {
					alternateLink.remove();
				});
			}

			// Create alternate links in the head for every language other than the current language
			this._languages.forEach((language) => {
				if (language.language !== this._currentLanguage) {
					const alternateLink = document.createElement("link");
					alternateLink.classList.add("alternateLink");
					alternateLink.setAttribute("rel", "alternate");
					alternateLink.setAttribute("hreflang", language.language);
					alternateLink.setAttribute(
						"href",
						`${window.location.origin}/${language.language}/${this._currentRoute.join("/")}`
					);
					document.head.appendChild(alternateLink);
				}
			});
		}
	}

	// Method: _getLanguage
	// Gets the language from the path
	// Returns:
	// The language from the path without the route if languages are defined
	private _getLanguage(): string | undefined {
		if (this._languages) {
			let language = this._getTrimmedPath().split("/")[0];

			if (
				language.length === 2 &&
				this._languages.find((languageItem) => languageItem.language === language)
			) {
				return language;
			} else {
				return undefined;
			}
		}
	}

	// Method: _setLanguage
	// Sets the language
	// Parameters:
	// language - The language
	private _setLanguage(language: string): void {
		if (this._languages) {
			let route = this._currentRoute.join("/");

			window.history.pushState({}, "", `/${language}/${route}`);
		}
	}

	// Method: _getLanguageFile
	// Gets the language file of the current language
	// Returns:
	// The language file of the current language
	private async _getLanguageFile(): Promise<{
		langElement: { content?: string; ariaLabel?: string; alt?: string };
	}> {
		let languageFile = await fetch(this._languagesFolder + "/" + this._currentLanguage + ".json");

		return await languageFile.json();
	}

	// Method: _getPreferredLanguage
	// Gets the first preferred language from the browser that is supported by the router
	private _getPreferredLanguage(): string | undefined {
		if (this._languages) {
			const browserLanguages = navigator.languages;

			for (let i = 0; i < browserLanguages.length; i++) {
				const languageCode = browserLanguages[i].split("-")[0];
				for (let j = 0; j < this._languages.length; j++) {
					if (languageCode == this._languages[j].language) {
						return this._languages[j].language;
					}
				}
			}
		}
		return undefined;
	}

	// Method: _translate
	// Translates the page to the current language
	// Parameters:
	// elements - The elements to translate
	private _translate(elements: NodeListOf<Element>): void {
		if (this._languages) {
			elements.forEach((element) => {
				const langId = element.getAttribute("data-lang-id");

				console.log(langId);

				if (langId && this._languageFile) {
					const langElement = this._languageFile[langId];

					if (langElement) {
						if (langElement.content) {
							element.innerHTML = langElement.content;
						}

						if (langElement.ariaLabel) {
							element.setAttribute("aria-label", langElement.ariaLabel);
						}

						if (langElement.alt) {
							element.setAttribute("alt", langElement.alt);
						}
					}
				}
			});
		}
	}

	// Method: _setupRouterLinks
	// Sets up the router links
	private _setupRouterLinks(links: NodeListOf<Element>): void {
		links.forEach((link) => {
			link.addEventListener("click", (event) => {
				event.preventDefault();

				const href = link.getAttribute("href");

				if (href) {
					this._setRoute(href);
				}
			});
		});
	}

	// Method: _getRoute
	// Gets the route from the path
	// Returns:
	// The route from the path without the language
	private _getRoute(): string[] {
		let path = this._getTrimmedPath();

		if (this._languages) {
			path = path.replace(this._getLanguage() + "/", "");
		}

		let pathArray = path.split("/");

		if (pathArray[0] === "") {
			pathArray[0] = this._defaultRoute;
		}

		return pathArray;
	}

	// Method: _setRoute
	// Sets the route
	// Parameters:
	// route - The route
	private _setRoute(route: string): void {
		if (this._languages) {
			window.history.pushState({}, "", `/${this._currentLanguage}/${route}`);
		} else {
			window.history.pushState({}, "", `/${route}`);
		}

		this._currentRoute = this._getRoute();
		if (this._languageLinks) {
			this._setupLanguageLinks(this._languageLinks);
		}
	}
}

const router = new Router(
	"root",
	[{ route: "home", component: "home/home" }],
	"home",
	"routerLink",
	"/routes",
	[
		{ language: "da", image: "da.svg" },
		{ language: "en", image: "en.svg" },
	],
	"da",
	"languageLink",
	"/assets/lang"
);
