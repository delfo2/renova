-- AlterEnum
ALTER TYPE "Speaker" ADD VALUE 'TOOL';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "tool_calls" TEXT;
