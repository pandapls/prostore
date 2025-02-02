/*
  Warnings:

  - You are about to drop the column `itemPrice` on the `Order` table. All the data in the column will be lost.
  - Added the required column `itemsPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "itemPrice",
ADD COLUMN     "itemsPrice" DECIMAL(12,2) NOT NULL;
