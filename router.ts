class Router {
	// Property: _rootElement
	// The root element of the router
	private _rootElement: HTMLElement | null = null;

	// Property: _rootElementID
	// The ID of the root element of the router
	private _rootElementID: string;

	// Property: _routes
	// The routes of the router
	private _routes: Array<{ route: string; component: string; script?: boolean }>;

	// Property: _defaultRoute
	// The default route of the router
	private _defaultRoute: string;

	// Property: _currentRoute
	// The current route of the router
	private _currentRoute: string;

	// Property: _routerLinkClass
	// The router link class of the router
	private _routerLinkClass: string;

	// Property: _languages
	// The languages of the router
	private _languages: Array<{ language: string; image: string }> | undefined;

	// Property: _defaultLanguage
	// The default language of the router
	private _defaultLanguage: string | undefined;

	// Property: _currentLanguage
	// The current language of the router
	private _currentLanguage: string | undefined;

	// Property: _languageFile
	// The language file of the current language
	private _languageFile: { langElement: { content: string } } | undefined;

	// Property: _languageSwitcherClass
	// The language switcher class of the router
	private _languageSwitcherClass: string | undefined;

	// Constructor
	// Parameters:
	// rootElementID - The ID of the root element
	// routes - The routes of the router
	// defaultRoute - The default route of the router
	// routerLinkClass - The router link class of the router
	// languages? - The languages of the router
	// defaultLanguage? - The default language of the router
	// languageSwitcherClass? - The language switcher class of the router
	constructor(
		rootElementID: string,
		routes: Array<{ route: string; component: string; script?: boolean }>,
		defaultRoute: string,
		routerLinkClass: string,
		languages?: Array<{ language: string; image: string }>,
		defaultLanguage?: string,
		languageSwitcherClass?: string
	) {
		if (!rootElementID) {
			throw new Error("rootElementID is required");
		}
		if (!routes) {
			throw new Error("routes is required");
		}
		if (!defaultRoute) {
			throw new Error("defaultRoute is required");
		}
		if (!routerLinkClass) {
			throw new Error("routerLinks is required");
		}
		if (languages && !defaultLanguage) {
			throw new Error("defaultLanguage is required");
		}
		if (languages && !languageSwitcherClass) {
			throw new Error("languageSwitcherClass is required");
		}

		this._rootElementID = rootElementID;
		this._routes = routes;
		this._defaultRoute = defaultRoute;
		this._currentRoute = window.location.pathname;
		this._routerLinkClass = routerLinkClass;
		if (languages && defaultLanguage && languageSwitcherClass) {
			this._languages = languages;
			this._defaultLanguage = defaultLanguage;
			this._currentLanguage = defaultLanguage;
			this._languageSwitcherClass = languageSwitcherClass;
		}

		if (this._languages && !localStorage.getItem("siteLanguage")) {
			this._currentLanguage = this._getPreferredLanguage();
		} else if (this._languages && localStorage.getItem("siteLanguage")) {
			this._currentLanguage = localStorage.getItem("siteLanguage") || this._defaultLanguage;
		}
		if (this._currentLanguage) {
			this._setLanguage(this._currentLanguage).then(() => {
				console.log(this._languageFile);
			});
		}
	}

	// Method: _init
	// Initializes the router

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

	// Method: _setLanguage
	// Sets the language of the router in the url and in the local storage
	private async _setLanguage(language: string): Promise<void> {
		if (this._languages) {
			localStorage.setItem("siteLanguage", language);
			this._currentLanguage = language;
			this._navigateTo(window.location.pathname);

			// Fetch the language file
			const languageFile = await fetch(`/assets/lang/${language}.json`);
			this._languageFile = await languageFile.json();
		}
	}

	// Method: _setupLanguage
	// Sets up the language on the page from the language file of the current language
	// Parameters:
	// domElement - The DOM element to set up the language on
	private _setupLanguage(domElement: HTMLElement | Document): HTMLElement | undefined {
		if (this._languageFile) {
			const elements = domElement.querySelectorAll("[data-lang-id]");
			elements.forEach((element) => {
				const langID = element.getAttribute("data-lang-id");
				if (langID && this._languageFile) {
					const langElement = this._languageFile[langID];
					if (langElement.content) {
						element.innerHTML = langElement.content;
					}
					if (langElement.ariaLabel) {
						element.setAttribute("aria-label", langElement.ariaLabel);
					}
				}
			});
		}
		return undefined;
	}

	// Method: _navigateTo
	// Navigates to a route
	private _navigateTo(route: string): void {
		window.history.pushState({}, route, "/" + this._currentLanguage + route);
		this._currentRoute = route;
	}
}

new Router(
	"root",
	[{ route: "/home", component: "home/home" }],
	"/home",
	"routerLink",
	[
		{ language: "da", image: "da.svg" },
		{ language: "en", image: "en.svg" },
	],
	"da",
	"languageSwitcher"
);
