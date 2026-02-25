import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTicketDto } from "../dto/ticket.dto";
import { TicketRepository } from "../repositories/ticket.repository";
import { ReserveTicketDto } from "../dto/reserve-ticket.dto";
import { ReserveAction } from "src/common/enums/reserve-action.enum";
import { Ticket } from "../entities/ticket.entity";
import { ReserveHistory } from "../entities/reserve-history.entity";
import { ReserveRecord } from "../entities/reserve-record.entity";
import { Summary } from "../entities/reserve-summary.entity";

@Injectable()
export class TicketService {
    constructor(
        private repo: TicketRepository,
    ) { }

    async create(dto: CreateTicketDto): Promise<Ticket> {
        return await this.repo.create(dto);
    }

    async delete(id: string): Promise<string> {
        await this.repo.findById(id);
        return await this.repo.delete(id);
    }

    async getSummary(): Promise<Summary> {
        const histories = await this.repo.reserveHistory();
        const uniqueUser = histories.reduce((acc, cur) => {
            acc[cur.userId + "|" + cur.ticketId] = cur.action;
            return acc;
        },{});

        const summary = Object.values(uniqueUser).reduce((acc: Summary,cur: string) => {
            acc[cur] = (acc[cur] || 0) + 1;
            return acc
        }, {CANCEL:0, RESERVE:0}) as Summary


        return summary
    }

    async findAll(userId: string): Promise<Ticket[]> {
        type TicketWithIsReserved = Ticket & {
            isReserved?: boolean,
            ticketReserved?: number,
        }
        const allTicket: TicketWithIsReserved[] = await this.repo.findAll();
        const myReservedRecords = await this.repo.findReserveRecordByUserId(userId);

        for (let i = 0; i < allTicket.length; i++) {
            const ticket = allTicket[i];
            if (ticket.id) {
                const reserveByTicketId = await this.findReserveRecordById(ticket.id);
                const reserveRecordForTicket = myReservedRecords.find(r => r.ticketId === ticket.id);
                ticket.isReserved = reserveRecordForTicket !== undefined ? true : false;
                ticket.outOfTicket = reserveByTicketId.length >= ticket.totalOfSeat;
                ticket.ticketReserved = reserveByTicketId.length;
            }
        }
        return allTicket;
    }

    async findById(id: string): Promise<Ticket> {
        const ticket = await this.repo.findById(id);
        if (!ticket) throw new NotFoundException('Ticket not found');
        return ticket;
    }

    async reservationHistory(): Promise<ReserveHistory[]> {
        return await this.repo.reserveHistory();
    }

    async myReservationHistory(userId: string): Promise<ReserveHistory[]> {
        return await this.repo.myReserveHistory(userId);
    }

    async createReserveHistory(data: ReserveTicketDto, ticketName: string): Promise<ReserveHistory> {
        return this.repo.createReserveHistory(
            {
                ticketId: data.ticketId,
                action: ReserveAction[data.reserveAction],
                userId: data.userId,
                dataTime: new Date(),
                ticketName: ticketName
            }
        );
    }

    async findReserveRecordById(ticketId: string): Promise<ReserveRecord[]> {
        return await this.repo.findReserveRecordById(ticketId);
    }

    async reservation(dto: ReserveTicketDto): Promise<string> {
        const ticket = await this.repo.findById(dto.ticketId);
        const reserveAction = ReserveAction[dto.reserveAction];
        const myReservedRecords = await this.repo.findReserveRecordByUserId(dto.userId);
        let ticketId = "";
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

                await this.createReserveHistory(dto, ticket.concertName);
                ticketId = await this.repo.reserve(dto);
            } else {
                const reserveRecordToRemove = myReservedRecords.find(r => r.ticketId === dto.ticketId);
                if (!reserveRecordToRemove?.id) {
                    throw new BadRequestException('Not found reserved ticket');
                }

                await this.createReserveHistory(dto, ticket.concertName);
                ticketId = await this.repo.removeReserveTicket(reserveRecordToRemove.id);
            }
        }
        return ticketId;
    }
}