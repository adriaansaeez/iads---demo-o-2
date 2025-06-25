/*
  Warnings:

  - You are about to drop the column `prompt` on the `prompts` table. All the data in the column will be lost.
  - Added the required column `finalPrompt` to the `prompts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prompts" DROP COLUMN "prompt",
ADD COLUMN     "adStyle" TEXT,
ADD COLUMN     "additionalInstructions" TEXT,
ADD COLUMN     "brandAnalysis" JSONB,
ADD COLUMN     "cleanedPrompt" TEXT,
ADD COLUMN     "colorScheme" TEXT,
ADD COLUMN     "creativePrompts" JSONB,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "finalPrompt" TEXT NOT NULL,
ADD COLUMN     "generationStatus" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN     "imageModel" TEXT,
ADD COLUMN     "imageQuality" TEXT,
ADD COLUMN     "imageSize" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "originalFormData" JSONB,
ADD COLUMN     "processingTime" INTEGER,
ADD COLUMN     "targetAudience" TEXT,
ADD COLUMN     "typography" TEXT;
