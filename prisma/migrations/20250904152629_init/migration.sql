/*
  Warnings:

  - You are about to drop the column `clinicID` on the `Doctor` table. All the data in the column will be lost.
  - Added the required column `clinicId` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Doctor" DROP CONSTRAINT "Doctor_clinicID_fkey";

-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "clinicID",
ADD COLUMN     "clinicId" INTEGER NOT NULL,
ADD COLUMN     "email" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Doctor" ADD CONSTRAINT "Doctor_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
