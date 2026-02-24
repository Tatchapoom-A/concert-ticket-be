import { Injectable, NotFoundException } from "@nestjs/common";
import { Ticket } from "../entities/ticket.entity";
import { randomUUID } from "crypto";
import { ReserveRecord } from "../entities/reserve-record.entity";
import { ReserveHistory } from "../entities/reserve-history.entity";
import { ReserveAction } from "src/common/enums/reserve-action.enum";

@Injectable()
export class TicketRepository {
    private tickets: Ticket[] = [
        {
            id: "ed1386c4-43d3-4de3-9c21-6788ee1c8df3",
            concertName: "Mock Concert 001",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
            totalOfSeat: 3
        }
    ];

    private reserveRecord: ReserveRecord[] = [
        {
            id: "56fd2d7a-8e7d-4a8d-9f36-061d3932220d",
            ticketId: "ed1386c4-43d3-4de3-9c21-6788ee1c8df3",
            userId: "001"
        },
        {
            id: "9a98c773-dc36-47d2-ba37-7afed2e29e79",
            ticketId: "ed1386c4-43d3-4de3-9c21-6788ee1c8df3",
            userId: "002"
        },
        {
            id: "37e6edf1-884d-4bb1-90e3-96758e0bfaf4",
            ticketId: "ed1386c4-43d3-4de3-9c21-6788ee1c8df3",
            userId: "003"
        }
    ];
    private reserveHistories: ReserveHistory[] = [];

    async create(data: Ticket): Promise<Ticket> {

        type FullTicket = Required<Ticket>
        const ticket: FullTicket = {
            id: randomUUID(),
            outOfTicket: false,
            ...data
        };
        this.tickets.push(ticket);
        return ticket;
    }

    async findAll(): Promise<Ticket[]> {
        return this.tickets;
    }

    async findById(id: string): Promise<Ticket> {
        const ticket = this.tickets.find(t => t.id === id);
        if (!ticket) throw new NotFoundException('Ticket not found');
        return ticket;
    }

    async delete(id: string): Promise<string> {
        this.tickets = this.tickets.filter(t => t.id !== id);
        return id;
    }

    async reserveHistory(): Promise<ReserveHistory[]> {
        return this.reserveHistories;
    }

    async myReserveHistory(userId: string): Promise<ReserveHistory[]> {
        return this.reserveHistories.filter(i => i.userId === userId);
    }

    async createReserveHistory(data: ReserveHistory): Promise<ReserveHistory> {
        const reserveHistory: ReserveHistory = {
            id: randomUUID(),
            ...data
        };
        this.reserveHistories.push(reserveHistory);
        return reserveHistory;
    }

    async findReserveRecordById(ticketId: string): Promise<ReserveRecord[]> {
        return this.reserveRecord.filter(r => r.ticketId === ticketId);
    }

    async findReserveRecordByUserId(userId: string): Promise<ReserveRecord[]> {
        return this.reserveRecord.filter(r => r.userId === userId);
    }

    async reserve(data: ReserveRecord): Promise<string> {
        const reserveData = {
            id: randomUUID(),
            ...data
        }
        this.reserveRecord.push(reserveData);
        return reserveData.id;
    }

    async removeReserveTicket(ticketId: string): Promise<string> {
        this.reserveRecord = this.reserveRecord.filter(i => i.id !== ticketId);
        return ticketId;
    }
}