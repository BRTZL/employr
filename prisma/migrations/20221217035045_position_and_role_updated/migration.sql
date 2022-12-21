-- AlterTable
ALTER TABLE "User" ADD COLUMN     "position" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "department" DROP DEFAULT;
