-- CreateTable
CREATE TABLE `users` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `email` VARCHAR(191) NOT NULL,
    `pass` VARCHAR(191) NOT NULL,
    `title` ENUM('MR', 'MS', 'MRS', 'DR') NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `zip` VARCHAR(191) NULL,
    `settlement` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `streetType` ENUM('STREET', 'AVENUE', 'ROAD', 'BLVD') NULL,
    `houseNumber` VARCHAR(191) NULL,
    `floorNumber` VARCHAR(191) NULL,
    `doorNumber` VARCHAR(191) NULL,
    `confirmationCode` VARCHAR(191) NULL,
    `salt` VARCHAR(191) NULL,
    `userConfirmed` BOOLEAN NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cars` (
    `carID` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `make` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`carID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car_images` (
    `imageID` INTEGER NOT NULL AUTO_INCREMENT,
    `carID` INTEGER NOT NULL,
    `path` VARCHAR(191) NULL,
    `extension` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`imageID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_conversations` (
    `conversationID` INTEGER NOT NULL AUTO_INCREMENT,
    `initiator` INTEGER NOT NULL,
    `receiver` INTEGER NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`conversationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_messages` (
    `messageID` INTEGER NOT NULL AUTO_INCREMENT,
    `conversationID` INTEGER NOT NULL,
    `senderID` INTEGER NOT NULL,
    `carID` INTEGER NULL,
    `message` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`messageID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `reportID` INTEGER NOT NULL AUTO_INCREMENT,
    `repoterID` INTEGER NULL,
    `carID` INTEGER NOT NULL,
    `reportType` ENUM('USER', 'CAR') NOT NULL,
    `message` VARCHAR(191) NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`reportID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `two_factor_keys` (
    `keyID` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `issuedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiredAt` DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL 5 MINUTE),

    PRIMARY KEY (`keyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cars` ADD CONSTRAINT `cars_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `car_images` ADD CONSTRAINT `car_images_carID_fkey` FOREIGN KEY (`carID`) REFERENCES `cars`(`carID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_conversations` ADD CONSTRAINT `user_conversations_initiator_fkey` FOREIGN KEY (`initiator`) REFERENCES `users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_conversations` ADD CONSTRAINT `user_conversations_receiver_fkey` FOREIGN KEY (`receiver`) REFERENCES `users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_messages` ADD CONSTRAINT `user_messages_conversationID_fkey` FOREIGN KEY (`conversationID`) REFERENCES `user_conversations`(`conversationID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_messages` ADD CONSTRAINT `user_messages_senderID_fkey` FOREIGN KEY (`senderID`) REFERENCES `users`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_messages` ADD CONSTRAINT `user_messages_carID_fkey` FOREIGN KEY (`carID`) REFERENCES `cars`(`carID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_repoterID_fkey` FOREIGN KEY (`repoterID`) REFERENCES `users`(`userID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reports` ADD CONSTRAINT `reports_carID_fkey` FOREIGN KEY (`carID`) REFERENCES `cars`(`carID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `two_factor_keys` ADD CONSTRAINT `two_factor_keys_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `users`(`userID`) ON DELETE CASCADE ON UPDATE CASCADE;
