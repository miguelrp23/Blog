/*
  Warnings:

  - Made the column `text` on table `publicacion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `publicacion` MODIFY `text` VARCHAR(191) NOT NULL;
