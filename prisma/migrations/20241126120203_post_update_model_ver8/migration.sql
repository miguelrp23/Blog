/*
  Warnings:

  - You are about to alter the column `isBanned` on the `newuser` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `newuser` MODIFY `isBanned` BOOLEAN NOT NULL DEFAULT false;
