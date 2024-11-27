/*
  Warnings:

  - You are about to alter the column `isBanned` on the `newuser` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `newuser` MODIFY `isBanned` VARCHAR(191) NOT NULL;
