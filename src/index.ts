import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import microConfig from './mikro-orm.config';

/*
 * MAIN FUNCTION
 * 
 * MikroORM is a TypeScript library that supports object relational mapping.
 * 
 * orm is an MikroORM instance 
 * 
 *  find: Retrieves entries of specified entity with an options parameter. 
 * 
 *  create: Creating an object of a specified entity. We could also create
 *  a class constructor and create the object that way.
 * 
 *  persistAndFlush: Insert an object into the database.
 * 
 *  nativeInsert: A different method of insertion. Need to go further into tutorial to see results.
 */

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    // const posts = await orm.em.find(Post, {});
    // console.log(posts);

    // const post = orm.em.create(Post, {createdAt: new Date(), updatedAt: new Date(), title: 'My First Post'});   
    // await orm.em.persistAndFlush(post);

    // orm.em.nativeInsert(Post, {createdAt: new Date(), updatedAt: new Date(), title: 'My First Post 2c'});
}

main().catch((err) => {
    console.error(err);
});