import { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      PORT?: string;
      MONGO_URI: string;
      PASSWORD_KEY: string;
      JWT_ACCESS_SECRET: Secret;
      JWT_ACCESS_EXPIRE: number;
      JWT_REFRESH_SECRET: Secret;
      JWT_REFRESH_EXPIRE: number;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
