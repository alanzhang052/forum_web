import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { ObjectType, Field } from "type-graphql";

/*
 * A basic class for posts on the database.
 */

@ObjectType()
@Entity()
export class Post {
  @Field()
  @PrimaryKey()
  id!: number;

  // Why does em.create require this property instead of taking the default value?
  @Field(() => String)
  @Property({ type: "date" })
  createdAt = new Date();

  // Why does em.create require this property instead of taking the default value?
  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
