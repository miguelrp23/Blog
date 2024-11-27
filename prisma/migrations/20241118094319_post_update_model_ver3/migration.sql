/*
  Warnings:

  - You are about to alter the column `userId` on the `publicacion` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `publicacion` DROP FOREIGN KEY `publicacion_userId_fkey`;

-- AlterTable
ALTER TABLE `publicacion` MODIFY `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `publicacion` ADD CONSTRAINT `publicacion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `NewUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
