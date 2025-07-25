/*
  Warnings:

  - Added the required column `placesId` to the `Tours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tours" ADD COLUMN     "placesId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Tours" ADD CONSTRAINT "Tours_placesId_fkey" FOREIGN KEY ("placesId") REFERENCES "Places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
