import { PrismaClient } from "@prisma/client";

declare global {
    namespace Prisma {
        interface PrismaClient {
            homePage: any;
        }
    }
}
