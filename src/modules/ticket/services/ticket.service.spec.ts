import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from '../repositories/ticket.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ReserveAction } from 'src/common/enums/reserve-action.enum';

describe('TicketService', () => {
  let service: TicketService;
  let repo: jest.Mocked<TicketRepository>;

  const mockTicketRepository = {
    create: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    delete: jest.fn(),
    findReserveRecordById: jest.fn(),
    findReserveRecordByUserId: jest.fn(),
    createReserveHistory: jest.fn(),
    reserve: jest.fn(),
    removeReserveTicket: jest.fn(),
    reserveHistory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        { provide: TicketRepository, useValue: mockTicketRepository },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    repo = module.get(TicketRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('Should return ticket data', async () => {
      const mockTicket = { id: '1', title: 'Concert A' };
      repo.findById.mockResolvedValue(mockTicket as any);

      const result = await service.findById('1');
      expect(result).toEqual(mockTicket);
      expect(repo.findById).toHaveBeenCalledWith('1');
    });

    it('Should throw NotFoundException', async () => {
      repo.findById.mockRejectedValue(new NotFoundException);

      await expect(service.findById('99')).rejects.toThrow(NotFoundException);
    });
  });

  describe('reservation (RESERVE)', () => {
    const reserveDto = {
      ticketId: 't1',
      userId: 'u1',
      reserveAction: ReserveAction.RESERVE,
    };

    it('Should throw BadRequestException if Out of ticket', async () => {
      repo.findById.mockResolvedValue({ id: 't1', totalOfSeat: 2 } as any);

      repo.findReserveRecordById.mockResolvedValue([{}, {}] as any);

      await expect(service.reservation(reserveDto)).rejects.toThrow(
        new BadRequestException('Out of ticket'),
      );
    });

    it('Should throw BadRequestException if User already reserved', async () => {
      repo.findById.mockResolvedValue({ id: 't1', totalOfSeat: 10 } as any);
      repo.findReserveRecordById.mockResolvedValue([]);

      repo.findReserveRecordByUserId.mockResolvedValue([{ ticketId: 't1' }] as any);

      await expect(service.reservation(reserveDto)).rejects.toThrow(
        new BadRequestException('You already reserve this concert'),
      );
    });

    it('should return ticketId', async () => {
      repo.findById.mockResolvedValue({ id: 't1', totalOfSeat: 10 } as any);
      repo.findReserveRecordById.mockResolvedValue([]);
      repo.findReserveRecordByUserId.mockResolvedValue([]);
      repo.reserve.mockResolvedValue('reserved-id-123');

      const result = await service.reservation(reserveDto);

      expect(result).toBe('reserved-id-123');
      expect(repo.reserve).toHaveBeenCalled();
    });
  });

  describe('getSummary', () => {
    const reserveDto = {
      ticketId: 't1',
      userId: 'u1',
      reserveAction: ReserveAction.RESERVE,
    };

    it('Should return summary data', async () => {
      repo.reserveHistory.mockResolvedValue([
        {
          id: '3eae8cb2-d75f-4196-81ac-d1788ad8006e',
          ticketId: '506279a2-7fc1-4ca3-8e3f-a28b17edb62e',
          action: 'RESERVE',
          userId: 'Poom',
          ticketName: 'Test con 002'
        },
        {
          id: '88995740-2a0f-4329-9797-ea5ec79af84f',
          ticketId: '3924198e-9fd9-41a7-bc7e-cfd1c26ac2f7',
          action: 'RESERVE',
          userId: 'Poom',
          ticketName: 'Test con 002'
        },
        {
          id: '7df64fe2-94e1-4634-967b-391adb09daf5',
          ticketId: '5c27d008-bc0e-46a4-89dd-6a2ec69b195f',
          action: 'RESERVE',
          userId: 'Poom',
          ticketName: 'Test con 002'
        },
        {
          id: 'e235bcd2-d540-4bfd-b3f2-b2b1239d20d8',
          ticketId: '3924198e-9fd9-41a7-bc7e-cfd1c26ac2f7',
          action: 'CANCEL',
          userId: 'Poom',
          ticketName: 'Test con 002'
        }
      ] as any);

      const result = await service.getSummary();
      expect(result).toStrictEqual({
        "CANCEL": 1,
        "RESERVE": 2
      });
    });
  });
});
