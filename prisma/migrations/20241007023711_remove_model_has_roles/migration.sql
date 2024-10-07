/*
  Warnings:

  - You are about to alter the column `emailVerifiedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `createdAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `updatedAt` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the `model_has_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `model_has_roles` DROP FOREIGN KEY `model_has_roles_modelId_fkey`;

-- DropForeignKey
ALTER TABLE `model_has_roles` DROP FOREIGN KEY `model_has_roles_roleId_fkey`;

-- AlterTable
ALTER TABLE `users` MODIFY `emailVerifiedAt` TIMESTAMP NULL,
    MODIFY `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    MODIFY `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE `model_has_roles`;
