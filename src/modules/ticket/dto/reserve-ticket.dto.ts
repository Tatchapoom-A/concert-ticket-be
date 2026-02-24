import { IsBoolean, IsNotEmpty, IsString } from "class-validator"

export class MyReservationDto {
  @IsNotEmpty({ message: 'User ID can not be empty' })
  @IsString({ message: 'User ID must be a string' })
  userId: string
}

export class ReserveTicketDto extends MyReservationDto {

  @IsNotEmpty({ message: 'Ticket ID can not be empty' })
  @IsString({ message: 'Ticket ID must be a string' })
  ticketId: string


  @IsNotEmpty({ message: 'Reserve Action can not be empty' })
  @IsString({ message: 'Reserve Action must be string' })
  reserveAction: string
}


