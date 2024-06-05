import "dotenv/config";
import { defineConfig } from "drizzle-kit";
// import { ConnectionOptions } from "drizzle-kit/dist/types/ConnectionOptions"; // Import 'ConnectionOptions' from the correct module

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dbCredentials: {
        url: process.env.Database_URL as string,
    } ,
    // as ConnectionOptions,
    verbose: true,
    strict: true,
})