import { ReserveAction } from "src/common/enums/reserve-action.enum";

export class ReserveHistory {
    id?: string;
    ticketId: string;
    ticketName?: string;
    action: ReserveAction;
    userId: string;
    dataTime: Date;
}