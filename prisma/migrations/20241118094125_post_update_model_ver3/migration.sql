-- DropForeignKey
ALTER TABLE `publicacion` DROP FOREIGN KEY `publicacion_userId_fkey`;

-- AlterTable
ALTER TABLE `publicacion` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `publicacion` ADD CONSTRAINT `publicacion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `NewUser`(`user`) ON DELETE RESTRICT ON UPDATE CASCADE;
