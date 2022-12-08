import ThemeSwitcher from "./themeSwitcher.js";

new ThemeSwitcher(
	"themeSwitcher",
	[
		{
			name: "light",
			materialIcon: "light_mode",
		},
		{
			name: "dark",
			materialIcon: "dark_mode",
		},
	],
	["light", "dark"]
);
