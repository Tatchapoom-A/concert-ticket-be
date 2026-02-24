import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateTicketDto } from "../dto/ticket.dto";
import { TicketRepository } from "../repositories/ticket.repository";
import { ReserveTicketDto } from "../dto/reserve-ticket.dto";
import { ReserveAction } from "src/common/enums/reserve-action.enum";

@Injectable()
export class TicketService {
    constructor(
        private repo: TicketRepository,
    ) { }

    async create(dto: CreateTicketDto) {
        return await this.repo.create(dto);
    }

    async delete(id: string): Promise<string> {
        await this.repo.findById(id);
        return await this.repo.delete(id);
    }

    async findAll() {

        const allTicket = await this.repo.findAll();
        for (let i = 0; i < allTicket.length; i++) {
            const ticket = allTicket[i];
            if (ticket.id) {
                const reserveByTicketId = await this.findReserveRecordById(ticket.id);
                ticket.outOfTicket = reserveByTicketId.length >= ticket.totalOfSeat;
            }
        }
        return allTicket;
    }

    async reservationHistory() {
        return await this.repo.reserveHistory();
    }

    async myReservationHistory(userId: string) {
        return await this.repo.myReserveHistory(userId);
    }

    async createReserveHistory(data: ReserveTicketDto) {
        this.repo.createReserveHistory(
            {
                ticketId: data.ticketId,
                action: ReserveAction[data.reserveAction],
                userId: data.userId,
                dataTime: new Date()
            }
        );
    }

    async findReserveRecordById(ticketId: string) {
        return await this.repo.findReserveRecordById(ticketId);
    }

    async reservation(dto: ReserveTicketDto) {
        const ticket = await this.repo.findById(dto.ticketId);
        const reserveAction = ReserveAction[dto.reserveAction];
        const myReservedRecords = await this.repo.findReserveRecordByUserId(dto.userId);

        if (ticket) {
            if (reserveAction === ReserveAction.RESERVE) {
                const reserveByTicketId = await this.findReserveRecordById(dto.ticketId);
                if (reserveByTicketId.length >= ticket.totalOfSeat) {
                    throw new BadRequestException('Out of ticket');
                }

                const alreadyReserved = myReservedRecords.filter(i => i.ticketId === dto.ticketId).length > 0;
                if (alreadyReserved === true) {
                    throw new BadRequestException('You already reserve this concert');
                }

                await this.createReserveHistory(dto);
                return await this.repo.reserve(dto);
            } else {
                const reserveRecordToRemove = myReservedRecords.find(r => r.ticketId === dto.ticketId);
                if (!reserveRecordToRemove?.id) {
                    throw new BadRequestException('Not found reserved ticket');
                }

                await this.createReserveHistory(dto);
                return await this.repo.removeReserveTicket(reserveRecordToRemove.id);
            }
        }
    }
}