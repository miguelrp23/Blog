/*
  Warnings:

  - You are about to drop the column `authorId` on the `publicacion` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `publicacion` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `publicacion` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `publicacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `publicacion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `publicacion` DROP FOREIGN KEY `publicacion_authorId_fkey`;

-- AlterTable
ALTER TABLE `publicacion` DROP COLUMN `authorId`,
    DROP COLUMN `content`,
    DROP COLUMN `title`,
    ADD COLUMN `audio` VARCHAR(191) NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `text` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `publicacion` ADD CONSTRAINT `publicacion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `NewUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
