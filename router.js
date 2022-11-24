"use strict";
class Router {
    constructor(rootElement, routes, defaultRoute, navLinks) {
        this.rootElement = rootElement;
        this.routes = routes;
        this.defaultRoute = defaultRoute;
        this.currentRoute = defaultRoute;
        this.navLinks = navLinks;
        this.render();
        this.setupNavLinks();
    }
    // Method: navigate
    // Navigates to a route
    navigate(route) {
        this.currentRoute = route;
        window.history.pushState({}, "", route);
        this.render();
    }
    // Method: render
    // Renders the current route
    render() {
        let route = this.routes.find((route) => route.name === this.currentRoute);
        if (route) {
            fetch(`/components/${route.component}.html`)
                .then((response) => response.text())
                .then((html) => {
                this.rootElement.innerHTML = html;
            });
        }
    }
    // Method: navLinks
    // Adds click event listeners to all nav links
    setupNavLinks() {
        this.navLinks.forEach((link) => {
            link.addEventListener("click", (event) => {
                event.preventDefault();
                let route = link.getAttribute("href");
                if (route) {
                    this.navigate(route);
                }
                // Console log current path
                console.log(window.location.pathname);
            });
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let appRoot = document.getElementById("app");
    let routes = [
        { name: "/home", route: "/", component: "home/home" },
        { name: "/about", route: "/about", component: "about/about" },
        { name: "/contact", route: "/contact", component: "contact/contact" },
    ];
    let navLinks = document.querySelectorAll(".navLink");
    if (appRoot) {
        let router = new Router(appRoot, routes, "home", navLinks);
    }
});
console.log(window.location.pathname);
