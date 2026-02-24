import { Module } from '@nestjs/common';
import { TicketModule } from './modules/ticket/ticket.module';

@Module({
  imports: [TicketModule],
  providers: [],
})
export class AppModule {}
