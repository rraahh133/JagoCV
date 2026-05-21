-- ============================================================
-- JagoCV — SQL untuk phpMyAdmin / hosting MySQL
-- ============================================================
-- Perbaikan dari migration Prisma original:
--   1. Urutan tabel diurutkan agar FK tidak error (#1824)
--   2. profileImageUrl, bio → TEXT (sesuai schema.prisma @db.Text)
--   3. Experience.description, Education.description → TEXT
--   4. ChatMessage.content → TEXT (konten chat bisa panjang)
--   5. Tambah kolom passwordResetToken & passwordResetExpires di User
--   6. Semua FK di-defer ke bagian ALTER TABLE di bawah
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- ------------------------------------------------------------
-- 1. Template (tidak punya FK, dibuat pertama)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Template` (
    `id`         VARCHAR(191)                              NOT NULL,
    `name`       VARCHAR(191)                              NOT NULL,
    `type`       ENUM('ATS_CV','VISUAL_RESUME','WEB_PORTFOLIO') NOT NULL,
    `previewUrl` VARCHAR(191)                              NULL,
    `isActive`   BOOLEAN                                   NOT NULL DEFAULT TRUE,
    `createdAt`  DATETIME(3)                               NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3)                               NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. User (tidak punya FK)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `User` (
    `id`                   VARCHAR(191)                         NOT NULL,
    `email`                VARCHAR(191)                         NOT NULL,
    `password`             VARCHAR(191)                         NOT NULL,
    `name`                 VARCHAR(191)                         NOT NULL,
    `profileImageUrl`      TEXT                                 NULL,
    `subscriptionTier`     ENUM('BIASA','GO','ULTRA')           NOT NULL DEFAULT 'BIASA',
    `subscriptionEndsAt`   DATETIME(3)                          NULL,
    `aiCredits`            INTEGER                              NOT NULL DEFAULT 10,
    `portfolioViews`       INTEGER                              NOT NULL DEFAULT 0,
    `deletedAt`            DATETIME(3)                          NULL,
    `createdAt`            DATETIME(3)                          NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`            DATETIME(3)                          NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    `bio`                  TEXT                                 NULL,
    `headline`             VARCHAR(191)                         NULL,
    `location`             VARCHAR(191)                         NULL,
    `passwordResetToken`   VARCHAR(191)                         NULL,
    `passwordResetExpires` DATETIME(3)                          NULL,
    UNIQUE INDEX `User_email_key` (`email`),
    INDEX `User_email_idx` (`email`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. UserSocial (FK → User)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `UserSocial` (
    `id`       VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `url`      VARCHAR(191) NOT NULL,
    `userId`   VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `UserSocial_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. UserPhone (FK → User)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `UserPhone` (
    `id`     VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `label`  VARCHAR(191) NOT NULL DEFAULT 'Utama',
    `userId` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `UserPhone_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Experience (FK → User)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Experience` (
    `id`          VARCHAR(191) NOT NULL,
    `company`     VARCHAR(191) NOT NULL,
    `position`    VARCHAR(191) NOT NULL,
    `location`    VARCHAR(191) NULL,
    `startDate`   DATETIME(3)  NOT NULL,
    `endDate`     DATETIME(3)  NULL,
    `description` TEXT         NULL,
    `isCurrent`   BOOLEAN      NOT NULL DEFAULT FALSE,
    `userId`      VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Experience_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Education (FK → User)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Education` (
    `id`           VARCHAR(191) NOT NULL,
    `institution`  VARCHAR(191) NOT NULL,
    `degree`       VARCHAR(191) NOT NULL,
    `fieldOfStudy` VARCHAR(191) NULL,
    `startDate`    DATETIME(3)  NOT NULL,
    `endDate`      DATETIME(3)  NULL,
    `description`  TEXT         NULL,
    `userId`       VARCHAR(191) NOT NULL,
    PRIMARY KEY (`id`),
    INDEX `Education_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Document (FK → User, Template)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Document` (
    `id`         VARCHAR(191)                                    NOT NULL,
    `title`      VARCHAR(191)                                    NOT NULL,
    `type`       ENUM('ATS_CV','VISUAL_RESUME','WEB_PORTFOLIO')  NOT NULL,
    `status`     ENUM('DRAF','SELESAI','DITERBITKAN')            NOT NULL DEFAULT 'DRAF',
    `content`    JSON                                            NULL,
    `templateId` VARCHAR(191)                                    NULL DEFAULT 'standard',
    `fontFamily` VARCHAR(191)                                    NULL DEFAULT 'Inter',
    `themeColor` VARCHAR(191)                                    NULL DEFAULT 'blue',
    `slug`       VARCHAR(191)                                    NULL,
    `views`      INTEGER                                         NOT NULL DEFAULT 0,
    `deletedAt`  DATETIME(3)                                     NULL,
    `userId`     VARCHAR(191)                                    NOT NULL,
    `createdAt`  DATETIME(3)                                     NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt`  DATETIME(3)                                     NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    UNIQUE INDEX `Document_slug_key` (`slug`),
    INDEX `Document_userId_idx` (`userId`),
    INDEX `Document_userId_deletedAt_idx` (`userId`, `deletedAt`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. ChatMessage (FK → User, Document)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ChatMessage` (
    `id`         VARCHAR(191)              NOT NULL,
    `role`       ENUM('USER','ASSISTANT')  NOT NULL,
    `content`    TEXT                      NOT NULL,
    `userId`     VARCHAR(191)              NOT NULL,
    `documentId` VARCHAR(191)              NULL,
    `createdAt`  DATETIME(3)               NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `ChatMessage_userId_idx` (`userId`),
    INDEX `ChatMessage_documentId_idx` (`documentId`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. AiUsageLog (FK → User, Document) — dibuat TERAKHIR
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `AiUsageLog` (
    `id`            VARCHAR(191) NOT NULL,
    `feature`       VARCHAR(191) NOT NULL,
    `creditsUsed`   INTEGER      NOT NULL DEFAULT 1,
    `promptSummary` VARCHAR(191) NULL,
    `userId`        VARCHAR(191) NOT NULL,
    `documentId`    VARCHAR(191) NULL,
    `createdAt`     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX `AiUsageLog_userId_idx` (`userId`),
    INDEX `AiUsageLog_createdAt_idx` (`createdAt`),
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- FOREIGN KEYS — ditambahkan setelah semua tabel dibuat
-- ============================================================

ALTER TABLE `UserSocial`
    ADD CONSTRAINT `UserSocial_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `UserPhone`
    ADD CONSTRAINT `UserPhone_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Experience`
    ADD CONSTRAINT `Experience_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Education`
    ADD CONSTRAINT `Education_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `Document`
    ADD CONSTRAINT `Document_templateId_fkey`
    FOREIGN KEY (`templateId`) REFERENCES `Template`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Document`
    ADD CONSTRAINT `Document_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChatMessage`
    ADD CONSTRAINT `ChatMessage_documentId_fkey`
    FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ChatMessage`
    ADD CONSTRAINT `ChatMessage_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `AiUsageLog`
    ADD CONSTRAINT `AiUsageLog_documentId_fkey`
    FOREIGN KEY (`documentId`) REFERENCES `Document`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `AiUsageLog`
    ADD CONSTRAINT `AiUsageLog_userId_fkey`
    FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE;

SET FOREIGN_KEY_CHECKS = 1;
