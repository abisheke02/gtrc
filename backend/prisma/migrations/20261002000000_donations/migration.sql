-- CreateEnum
CREATE TYPE "DonationStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "amountInr" INTEGER NOT NULL,
    "status" "DonationStatus" NOT NULL DEFAULT 'PENDING',
    "purpose" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "pan" TEXT,
    "address" TEXT,
    "message" TEXT,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_razorpayOrderId_key" ON "Donation"("razorpayOrderId");

-- CreateIndex
CREATE INDEX "Donation_status_createdAt_idx" ON "Donation"("status", "createdAt");
