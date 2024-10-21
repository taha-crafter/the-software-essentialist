import server from "./bootstrap";

const PORT = Number(process.env.PORT || 3000);

server.start(PORT);
