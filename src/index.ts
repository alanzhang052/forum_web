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
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em }),
    });

    apolloServer.applyMiddleware({ app });

    app.listen(3000, () => {
        console.log("Server started on http://localhost:3000/");
    });
};

main().catch((err) => {
    console.error(err);
});
