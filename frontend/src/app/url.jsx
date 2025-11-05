const protocol = window.location.protocol + "//";
const host = window.location.hostname;
const serverPort = host === "localhost" ? ":3001" : "";
const clientPost = host === "localhost" ? ":3000" : "";

let sBaseUrl = protocol + host + serverPort + "/api";
let cBaseUrl = protocol + host + clientPost;

export {sBaseUrl, cBaseUrl};