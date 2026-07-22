-- CreateTable
CREATE TABLE "bulkDiscountTier" (
    "id" TEXT NOT NULL,
    "minQuantity" INTEGER NOT NULL,
    "percentageOff" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bulkDiscountTier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bulkDiscountTier_minQuantity_key" ON "bulkDiscountTier"("minQuantity");
