/*
  Warnings:

  - You are about to drop the `_LeadTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LeadTags" DROP CONSTRAINT "_LeadTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_LeadTags" DROP CONSTRAINT "_LeadTags_B_fkey";

-- DropTable
DROP TABLE "_LeadTags";

-- CreateTable
CREATE TABLE "_lead_tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_lead_tags_AB_unique" ON "_lead_tags"("A", "B");

-- CreateIndex
CREATE INDEX "_lead_tags_B_index" ON "_lead_tags"("B");

-- AddForeignKey
ALTER TABLE "_lead_tags" ADD CONSTRAINT "_lead_tags_A_fkey" FOREIGN KEY ("A") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_lead_tags" ADD CONSTRAINT "_lead_tags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
