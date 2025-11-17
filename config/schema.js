import {pgTable, serial, integer, varchar } from "drizzle-orm/pg-core";

export const Users=pgTable('user',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    imageurl:varchar('imageurl').notNull(),
    credits:integer('credits').default(3)

})