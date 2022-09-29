-- CreateEnum
CREATE TYPE "EventZone" AS ENUM ('NO_APPLY', 'NEAR', 'FAR');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CLIENT', 'MANAGER');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD');

-- CreateEnum
CREATE TYPE "EvenStatus" AS ENUM ('SCHEDULED', 'CANCELED', 'LIVE', 'ENDED');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('RESERVED', 'PAID', 'CANCELED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CLOSED', 'CART');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('RESET_PASSWORD', 'AUTHENTICATE');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('MUSIC', 'COMEDY', 'THEATER');

-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CLIENT',

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Event" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "image" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,
    "likes_number" INTEGER NOT NULL DEFAULT 0,
    "status" "EvenStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Tickets_detail" (
    "uuid" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "nominal_price" INTEGER NOT NULL,
    "tickets_available" INTEGER NOT NULL,
    "zone" "EventZone" NOT NULL DEFAULT 'NO_APPLY',
    "tickets_per_person" INTEGER NOT NULL DEFAULT 1,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Tickets_detail_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "uuid" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "tickets_detail_id" TEXT NOT NULL,
    "discounts" JSONB,
    "final_price" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "tickets_to_buy" INTEGER NOT NULL DEFAULT 1,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "status" "TicketStatus" NOT NULL DEFAULT 'RESERVED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Order" (
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "discounts" JSONB,
    "final_price" INTEGER NOT NULL DEFAULT 0,
    "status" "OrderStatus" NOT NULL DEFAULT 'CART',
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Token" (
    "uuid" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "activity" "Activity" NOT NULL DEFAULT 'AUTHENTICATE',
    "sub" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_EventToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Token_sub_key" ON "Token"("sub");

-- CreateIndex
CREATE UNIQUE INDEX "Token_user_id_activity_key" ON "Token"("user_id", "activity");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToUser_AB_unique" ON "_EventToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToUser_B_index" ON "_EventToUser"("B");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tickets_detail" ADD CONSTRAINT "Tickets_detail_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_tickets_detail_id_fkey" FOREIGN KEY ("tickets_detail_id") REFERENCES "Tickets_detail"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToUser" ADD CONSTRAINT "_EventToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
