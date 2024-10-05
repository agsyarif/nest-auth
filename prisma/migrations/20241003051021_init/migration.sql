-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `emailVerifiedAt` TIMESTAMP NULL,
    `phone` VARCHAR(255) NULL,
    `password` VARCHAR(255) NULL,
    `userAvatarImage` TEXT NULL,
    `version` INTEGER NOT NULL DEFAULT 0,
    `lastPassword` VARCHAR(255) NULL,
    `passwordUpdatedAt` INTEGER NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model_has_roles` (
    `roleId` INTEGER NOT NULL,
    `modelId` INTEGER NOT NULL,

    PRIMARY KEY (`roleId`, `modelId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `model_has_roles` ADD CONSTRAINT `model_has_roles_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `model_has_roles` ADD CONSTRAINT `model_has_roles_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
