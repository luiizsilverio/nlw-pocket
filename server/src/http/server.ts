require('dotenv').config();
import fastify from "fastify";
import cors from '@fastify/cors';
import { routes } from "./routes";

const app = fastify();

app.register(cors, {
    origin: true,
});

app.register(routes);

app.listen({ port: 3333 }).then(() => {
    console.log(`Servidor NLW Pocket rodando na porta http://localhost:3333`)
})