import { User } from "src/entities/User";
import { MyContext } from "src/types";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    Query,
    Resolver,
} from "type-graphql";

@InputType()
class UsernamePasswordInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

@Resolver()
export class UserResolver {
    @Mutation(() => String)
    async register(
        @Arg("options") options: UsernamePasswordInput,
        @Ctx() { em }: MyContext
    ) {
        const user = em.create(User, {
            createdAt: new Date(),
            updatedAt: new Date(),
            username: options.username,
            password: null,
        });
        await em.persistAndFlush(user);
        return user;
    }
}
