import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { TicketService } from "../services/ticket.service";
import { CreateTicketDto } from "../dto/ticket.dto";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { MyReservationDto, ReserveTicketDto } from "../dto/reserve-ticket.dto";

@Controller('tickets')
export class TicketController {
    constructor(private ticketService: TicketService) { }

    @Post()
    @Roles(Role.ADMIN)
    async create(@Body() dto: CreateTicketDto) {
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
    async findAll() {
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

    @Get('reservations/me')
    @Roles(Role.USER)
    async myReservation(@Body() dto: MyReservationDto) {
        return await this.ticketService.myReservationHistory(dto.userId);
    }

    @Get('reservations/history')
    @Roles(Role.ADMIN)
    async reservationHistory() {
        return await this.ticketService.reservationHistory();
    }
}