import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TicketService } from "../services/ticket.service";
import { CreateTicketDto } from "../dto/ticket.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { ReserveTicketDto } from "../dto/reserve-ticket.dto";
import { Ticket } from "../entities/ticket.entity";
import { ReserveHistory } from "../entities/reserve-history.entity";

@Controller('tickets')
export class TicketController {
    constructor(private ticketService: TicketService) { }

    @Post()
    @Roles(Role.ADMIN)
    async create(@Body() dto: CreateTicketDto): Promise<Ticket> {
        return await this.ticketService.create(dto);
    }

    @Delete('/:id')
    @Roles(Role.ADMIN)
    async delete(@Param("id") ticketId: string) {
        await this.ticketService.delete(ticketId);
        return {
            success: true,
            id: ticketId
        }
    }

    @Get()
    async findAll(): Promise<Ticket[]> {
        return await this.ticketService.findAll();
    }

    @Post('reservations')
    @Roles(Role.USER)
    async reservation(@Body() dto: ReserveTicketDto) {
        const reserveId = await this.ticketService.reservation(dto);
        return {
            success: true,
            id: reserveId
        }
    }

    @Get('reservations/user/:userId')
    @Roles(Role.USER)
    async myReservation(@Param("userId") userId: string): Promise<ReserveHistory[]> {
        return await this.ticketService.myReservationHistory(userId);
    }

    @Get('reservations')
    @Roles(Role.ADMIN)
    async reservationHistory(): Promise<ReserveHistory[]> {
        return await this.ticketService.reservationHistory();
    }
}