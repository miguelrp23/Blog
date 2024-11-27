-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `dislikes` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `likes` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `post` ADD CONSTRAINT `post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `NewUser`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
