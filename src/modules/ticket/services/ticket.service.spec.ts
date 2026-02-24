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
});
