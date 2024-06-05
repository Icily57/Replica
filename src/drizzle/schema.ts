import { pgTable, text, varchar, uuid, index, boolean, real, timestamp, primaryKey, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const UserRole = pgEnum("userRole", ["AUTHOR", "CUSTOMER", "ADMIN", "NO_ROLE"]);  //enums are supported in postgresql 

//-----------------TABLES-----------------
//AUTHOR
export const AuthorTable = pgTable("author", {
    author_id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    bio: varchar("bio", { length: 255 }).notNull(),
    password: text("password").notNull(),
    role: UserRole("userRole").default("AUTHOR").notNull()
})
// //CUSTOMER
export const CustomerTable = pgTable("customer", {
    customer_id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    age: integer("age").notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    shipping_address: varchar("bio", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }).notNull(),
    role: UserRole("userRole").default("CUSTOMER").notNull()
})
// //ADMIN
export const AdminTable = pgTable("admin", {
    admin_id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: UserRole("userRole").default("ADMIN").notNull()
})
// //PUBLISHER
export const PublisherTable = pgTable("publisher", {
    publisher_id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    website_url: varchar("string", { length: 255 }).notNull(),
})
// //LANGUAGE
export const LanguageTable = pgTable("language", {
    language_id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("language", { length: 255 }).notNull(),
    code: varchar("code", { length: 255 }).notNull(),
})
// //BOOK
export const BookTable = pgTable("book", {
    book_id: uuid("id").primaryKey().defaultRandom(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    price: real("price").notNull(),
    published_date: timestamp("published_date").notNull(),
    author: uuid("author_id").notNull().references(() => AuthorTable.author_id, { onDelete: "cascade" }),
    publisher: uuid("publisher_id").notNull().references(() => PublisherTable.publisher_id, { onDelete: "cascade" }),
    language: uuid("language_id").notNull().references(() => LanguageTable.language_id, { onDelete: "cascade" }),
})
// //ORDER
export const OrderTable = pgTable("order", {
    order_id: uuid("id").primaryKey().defaultRandom(),
    order_date: timestamp("order_date").notNull(),
    total_price: real("total_price").notNull(),
    book: uuid("book_id").notNull().references(() => BookTable.book_id, { onDelete: "cascade" }),
    customer: uuid("customer_id").notNull().references(() => CustomerTable.customer_id, { onDelete: "cascade" }),
})

//-----------------RELATIONSHIPS----------------- (we don't do migrations for relationships)
export const AuthorTableRelations = relations(AuthorTable, ({ one }) => ({
    book: one(BookTable),
}));
export const CustomerTableRelations = relations(CustomerTable, ({ one }) => ({
    order: one(OrderTable),
}));
export const PublisherTableRelations = relations(PublisherTable, ({ one }) => ({
    book: one(BookTable),
}));
export const LanguageTableRelations = relations(LanguageTable, ({ one }) => ({
    book: one(BookTable),
}));
export const BookTableRelations = relations(BookTable, ({ one }) => ({
    author: one(AuthorTable, {
        fields: [BookTable.author],
        references: [AuthorTable.author_id]
    }),
    publisher: one(PublisherTable, {
        fields: [BookTable.publisher],
        references: [PublisherTable.publisher_id]
    }),
    language: one(LanguageTable, {
        fields: [BookTable.language],
        references: [LanguageTable.language_id]
    }),
    order: one(OrderTable),
}));
export const OrderTableRelations = relations(OrderTable, ({ one }) => ({
    book: one(BookTable, {
        fields: [OrderTable.book],
        references: [BookTable.book_id]
    }),
    customer: one(CustomerTable, {
        fields: [OrderTable.customer],
        references: [CustomerTable.customer_id]
    }),
}));

