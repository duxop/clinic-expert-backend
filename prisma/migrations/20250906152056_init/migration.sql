/*
  Warnings:

  - You are about to drop the column `doctorName` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `patientName` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Appointment" DROP COLUMN "doctorName",
DROP COLUMN "patientName";

-- AlterTable
ALTER TABLE "public"."Clinic" ADD COLUMN     "logo" TEXT,
ADD COLUMN     "workHours" TEXT;
