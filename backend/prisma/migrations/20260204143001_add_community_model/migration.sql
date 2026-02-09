/*
  Warnings:

  - You are about to drop the column `post_id` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Topic` table. All the data in the column will be lost.
  - You are about to drop the column `follows` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `posts` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_user_id_fkey";

-- AlterTable
ALTER TABLE "Topic" DROP COLUMN "post_id",
DROP COLUMN "user_id",
ADD COLUMN     "communityId" INTEGER,
ADD COLUMN     "ownerId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "follows",
DROP COLUMN "posts";

-- CreateTable
CREATE TABLE "Community" (
    "community_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("community_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Community_name_key" ON "Community"("name");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("community_id") ON DELETE SET NULL ON UPDATE CASCADE;
