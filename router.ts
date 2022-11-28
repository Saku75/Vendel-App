class Router {
	private _rootElementID: string;
	private _rootElement: HTMLElement | null = null;
	private _routes: Array<{ route: string; component: string; script?: boolean }>;
	private _defaultRoute: string;
	private _currentRoute: string;
	private _routerLinkClass: string;
	private _callBackFunction: (pageContent: Document | HTMLElement, routeData?: Array<any>) => void =
		() => {};

	constructor(
		rootElementID: string,
		routes: Array<{ route: string; component: string; script?: boolean }>,
		defaultRoute: string,
		routerLinkClass: string,
		callBackFunction?: (pageContent: Object, routeData?: Array<any>) => void
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

		this._rootElementID = rootElementID;
		this._routes = routes;
		this._defaultRoute = defaultRoute;
		this._currentRoute = window.location.pathname;
		this._routerLinkClass = routerLinkClass;
		if (callBackFunction) {
			this._callBackFunction = callBackFunction;
		}

		document.addEventListener("DOMContentLoaded", () => {
			this._rootElement = document.getElementById(this._rootElementID);
			this._render();
			this._setupRouterLinks(document);
		});
	}

	// Method: _getRouterLinks
	// Gets all router links
	private _getRouterLinks(element: Document | HTMLElement): NodeListOf<Element> {
		return element.querySelectorAll(`.${this._routerLinkClass}`);
	}

	// Method: _setupRouterLinks
	// Adds click event listeners to all router links
	private _setupRouterLinks(element: Document | HTMLElement): void {
		const routerLinks = this._getRouterLinks(element);
		routerLinks.forEach((link) => {
			link.addEventListener("click", (event) => {
				event.preventDefault();

				let route = link.getAttribute("href");

				if (route) {
					this._navigate(route);
				}
			});
		});
	}

	// Method: _navigate
	// Navigates to a route
	private _navigate(route: string): void {
		this._currentRoute = route;
		window.history.pushState({}, "", route);
		this._render();
	}

	// Method: _render
	// Renders the current route
	private _render(): void {
		let route = this._routes.find((route) => route.route === this._currentRoute);

		if (route) {
			fetch(`/pages/${route.component}.html`)
				.then((response) => response.text())
				.then((html) => {
					if (this._rootElement) {
						this._rootElement.innerHTML = html;
						this._callBackFunction(this._rootElement);
						this._setupRouterLinks(this._rootElement);
					}
				});
		}
	}
}

new Router(
	"root",
	[
		{ route: "/home", component: "home/home" },
		{ route: "/wishlist", component: "wishlist/overview" },
		{ route: "/wishlist/:id", component: "wishlist/wishlist" },
		{ route: "/wishlist/:id/:item", component: "wishlist/wish" },
		{ route: "/login", component: "auth/login" },
		{ route: "/register", component: "auth/register" },
		{ route: "/profile", component: "profile/profile" },
	],
	"/home",
	"routerLink"
);

fetch(`/pages/home/home.html`).then((response) =>
	// Create nodelist from response
	response.text().then((html) => {
		// Create new document from html
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, "text/html");
		const body = doc.body;

		// Get content from body
		const content = body.querySelector("article");

		console.log(content);
		console.log(typeof content);
	})
);
