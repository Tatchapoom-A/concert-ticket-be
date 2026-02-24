import { Module } from "@nestjs/common";
import { TicketController } from "./controllers/ticket.controller";
import { TicketService } from "./services/ticket.service";
import { TicketRepository } from "./repositories/ticket.repository";
import { APP_GUARD } from "@nestjs/core";
import { RoleGuard } from "src/common/guards/role.guard";

@Module({
    controllers: [TicketController],
    providers: [
        TicketService, 
        TicketRepository,
        {
              provide: APP_GUARD,
              useClass: RoleGuard
        }
    ],
    exports: [TicketService]
})

export class TicketModule {}