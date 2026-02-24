import { IsBoolean, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTicketDto {


  @IsNotEmpty({ message: 'Concert Name can not be empty' })
  @IsString({ message: 'Concert Name must be a string' })
  concertName: string

  @IsNotEmpty({ message: 'Description can not be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string

  @IsNotEmpty({ message: 'Total of seat can not be empty' })
  @IsNumber({},{ message: 'Total of seat must be a number' })
  totalOfSeat: number

  @IsOptional()
  @IsBoolean()
  outOfTicket: boolean
}


