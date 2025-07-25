/*
  Warnings:

  - You are about to drop the column `previewImagePath` on the `Places` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Places" DROP COLUMN "previewImagePath",
ADD COLUMN     "preview" TEXT;
