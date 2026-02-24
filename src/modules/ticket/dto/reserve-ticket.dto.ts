import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class ReserveTicketDto {

  @IsNotEmpty({ message: 'Ticket ID can not be empty' })
  @IsString({ message: 'Ticket ID must be a string' })
  ticketId: string

  @IsNotEmpty({ message: 'User ID can not be empty' })
  @IsString({ message: 'User ID must be a string' })
  userId: string

  @IsNotEmpty({ message: 'Reserve Action can not be empty' })
  @IsString({ message: 'Reserve Action must be string' })
  reserveAction: string
}


