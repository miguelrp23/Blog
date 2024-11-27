-- DropForeignKey
ALTER TABLE `publicacion` DROP FOREIGN KEY `Publicacion_userId_fkey`;

-- AlterTable
ALTER TABLE `publicacion` MODIFY `text` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `publicacion` ADD CONSTRAINT `publicacion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `NewUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
