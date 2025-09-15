import defaults from "./defaults.js";

export default (url: string): string =>
    defaults.cloudinaryFolder +
    url.slice(url.lastIndexOf("/"), url.lastIndexOf("."));
