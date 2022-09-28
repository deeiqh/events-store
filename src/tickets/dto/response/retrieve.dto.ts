// export class RetrieveTicketDto {
//   uuid String @id @default(uuid())
//   event_id String
//   tickets_detail_id String
//   discounts Json? // [{description: "without discount", percentage: 0, amount: 0}]
//   final_price Int
//   user_id String
//   order_id String

//   tickets_to_buy Int @default(1)
//   currency Currency @default(USD)
//   status TicketStatus @default(RESERVED)
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
//   deleted_at DateTime?

//   order Order @relation(fields: [order_id], references: [uuid])
//   tickets_detail Tickets_detail @relation(fields: [tickets_detail_id], references: [uuid])
//   event Event @relation(fields: [event_id], references: [uuid])
// }
