/*
  Warnings:

  - You are about to drop the column `description` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `imagePath` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `mapCode` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tours` table. All the data in the column will be lost.
  - You are about to drop the column `otherInfo` on the `Tours` table. All the data in the column will be lost.
  - Made the column `usersId` on table `Tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('CONSIDERING', 'APPROVED', 'DECLINED');

-- DropForeignKey
ALTER TABLE "Tokens" DROP CONSTRAINT "Tokens_usersId_fkey";

-- AlterTable
ALTER TABLE "Applications" ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'CONSIDERING';

-- AlterTable
ALTER TABLE "Tokens" ALTER COLUMN "usersId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Tours" DROP COLUMN "description",
DROP COLUMN "imagePath",
DROP COLUMN "images",
DROP COLUMN "mapCode",
DROP COLUMN "name",
DROP COLUMN "otherInfo";

-- CreateTable
CREATE TABLE "Places" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "previewImagePath" TEXT NOT NULL,
    "images" TEXT[],
    "mapCode" TEXT,
    "otherInfo" TEXT,

    CONSTRAINT "Places_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
