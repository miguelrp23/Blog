-- DropForeignKey
ALTER TABLE `publicacion` DROP FOREIGN KEY `publicacion_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Publicacion` ADD CONSTRAINT `Publicacion_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `NewUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
