-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "yield" DECIMAL(5,2) NOT NULL,
    "tiket" INTEGER NOT NULL,
    "daysLeft" INTEGER NOT NULL,
    "soldPercent" INTEGER NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);
