import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../entities/ticket.entity';
import { ReserveHistory } from '../entities/reserve-history.entity';
import { ReserveAction } from 'src/common/enums/reserve-action.enum';

describe('TicketController', () => {
  let controller: TicketController;
  let service: jest.Mocked<TicketService>;

  const mockTicketService = {
    create: jest.fn(),
    delete: jest.fn(),
    findAll: jest.fn(),
    reservation: jest.fn(),
    myReservationHistory: jest.fn(),
    reservationHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    }).compile();

    controller = module.get<TicketController>(TicketController);
    service = module.get(TicketService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create ticket', async () => {
      const dto = { name: 'concert' } as any;
      const result = {
        "id": "9b225b14-317e-4495-a541-66998531a2c8",
        "concertName": "Test con 002",
        "description": "dafsegsfsf",
        "totalOfSeat": 10
      };

      service.create.mockResolvedValue(result);

      const response = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should delete ticket', async () => {
      service.delete.mockResolvedValue('ticket1');

      const result = await controller.delete('ticket1');

      expect(service.delete).toHaveBeenCalledWith('ticket1');
      expect(result).toEqual({
        success: true,
        id: 'ticket1',
      });
    });
  });

  describe('findAll', () => {
    it('should return all tickets', async () => {
      const tickets = [{
        "id": "9b225b14-317e-4495-a541-66998531a2c8",
        "concertName": "Test con 002",
        "description": "dafsegsfsf",
        "totalOfSeat": 10
      }];
      service.findAll.mockResolvedValue(tickets);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(tickets);
    });
  });

  describe('reservation', () => {
    it('should reserve ticket', async () => {
      const dto = { ticketId: 't1', userId: 'u1' } as any;

      service.reservation.mockResolvedValue('reserve123');

      const result = await controller.reservation(dto);

      expect(service.reservation).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        success: true,
        id: 'reserve123',
      });
    });
  });

  describe('myReservation', () => {
    it('should return user reservations', async () => {
      const data: ReserveHistory[] = [{
        "id": "9e686f3c-8b68-4cfa-abfe-2affcb108782",
        "ticketId": "5088d938-13f4-4974-8f6e-2c65a70c8429",
        "action": ReserveAction.RESERVE,
        "userId": "008",
        "dataTime": new Date("2026-02-24T09:14:46.646Z")
      }];
      service.myReservationHistory.mockResolvedValue(data);

      const result = await controller.myReservation('user1');

      expect(service.myReservationHistory).toHaveBeenCalledWith('user1');
      expect(result).toEqual(data);
    });
  });

  describe('reservationHistory', () => {
    it('should return all reservation history', async () => {
      const data: ReserveHistory[] = [{
        "id": "9e686f3c-8b68-4cfa-abfe-2affcb108782",
        "ticketId": "5088d938-13f4-4974-8f6e-2c65a70c8429",
        "action": ReserveAction.RESERVE,
        "userId": "008",
        "dataTime": new Date("2026-02-24T09:14:46.646Z")
      }];
      service.reservationHistory.mockResolvedValue(data);

      const result = await controller.reservationHistory();

      expect(service.reservationHistory).toHaveBeenCalled();
      expect(result).toEqual(data);
    });
  });
});