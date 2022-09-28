// import { Type } from "class-transformer"
// import { RetrieveUserDto } from "src/user/dto/response/retrieve.dto"

// export class RetrieveOrderDto {
//   user_id String
//   discounts Json? // [{description: "without discount", percentage: 0, amount: 0}]
//   final_price Int
//   status OrderStatus @default(CART)

//   currency Currency @default(USD)
//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
//   deleted_at DateTime?

//   @Type(()=>RetrieveTicket[])
//   tickets: RetrieveTicket[]

//   @Type(()=> RetrieveUserDto)
//   user: RetrieveUserDto
// }
