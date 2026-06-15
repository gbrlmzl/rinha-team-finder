/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Equipe" ALTER COLUMN "nicknameCapitao" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "discordId" TEXT,
ADD COLUMN     "discordTag" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");
