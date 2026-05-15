-- AlterTable
ALTER TABLE "ClassSection" ADD COLUMN     "buttonLabel" TEXT,
ADD COLUMN     "buttonUrl" TEXT,
ADD COLUMN     "eyebrow" TEXT,
ADD COLUMN     "layout" TEXT NOT NULL DEFAULT 'TEXT';
