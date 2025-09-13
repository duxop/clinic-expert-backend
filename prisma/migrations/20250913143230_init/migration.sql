/*
  Warnings:

  - You are about to drop the column `prices` on the `Invoice` table. All the data in the column will be lost.
  - Changed the type of `items` on the `Invoice` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Invoice" DROP COLUMN "prices",
DROP COLUMN "items",
ADD COLUMN     "items" JSONB NOT NULL;
