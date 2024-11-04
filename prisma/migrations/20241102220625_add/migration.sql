-- CreateTable
CREATE TABLE "_LeadTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LeadTags_AB_unique" ON "_LeadTags"("A", "B");

-- CreateIndex
CREATE INDEX "_LeadTags_B_index" ON "_LeadTags"("B");

-- AddForeignKey
ALTER TABLE "_LeadTags" ADD CONSTRAINT "_LeadTags_A_fkey" FOREIGN KEY ("A") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LeadTags" ADD CONSTRAINT "_LeadTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
