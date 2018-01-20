import map from "./map.js";

const ngImage = angular.module("ngImage", []);

Object.keys(map).forEach((key) => {
	Object.keys(map[key]).forEach((name) => {
		ngImage[key.slice(0, -1)](name, map[key][name]);
	});
});

export default ngImage;
