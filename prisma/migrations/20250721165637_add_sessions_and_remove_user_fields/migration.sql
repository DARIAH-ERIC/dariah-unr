/*
  Warnings:

  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verified",
DROP COLUMN "image",
DROP COLUMN "status",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "secret_hash" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "last_verified_at" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
