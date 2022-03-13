import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

/*
 * MAIN FUNCTION
 *
 * MikroORM is a TypeScript library that supports ORM (object relational mapping) for databases.
 * In this case, the data we are utilizing is PostgreSQL.
 *
 * Express is the server framework.
 *
 * ApolloServer is a library that connects a GraphQL schema to a server, in this case, Express.
 * A schema is a representation of resolvers, which are collections of functions that
 * generates a response for a GraphQL query.
 *
 */

const main = async () => {
    // PostgreSQL Setup
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    // Express Setup
    const app = express();

    // Redis Setup
    // connectRedis is a deprecated function in library “@types/redis”.
    // Uninstalling the library allowed connectRedis from library “connect-redis” to work properly.
    const RedisStore = connectRedis(session);
    const redisClient = createClient({ legacyMode: true });
    redisClient.connect().catch(console.error);

    // Customize redis middleware
    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 1, // TTL of 1 year
                httpOnly: true,
                secure: __prod__, // Cookie will only work in https
                sameSite: "lax",
            },
            saveUninitialized: false,
            secret: "abcdefghijklmnopqrstuvwxyz",
            resave: false,
        })
    );

    // Customize apolloServer middleware
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });

    // Apply middleware
    apolloServer.applyMiddleware({ app });

    // Launch express app
    app.listen(3000, () => {
        console.log("Server started on http://localhost:3000/");
    });
};

main().catch((err) => {
    console.error(err);
});
