import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RoleGuard } from './role.guard';
import { Role } from '../enums/role.enum';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let reflector: Reflector;

  const createMockContext = (headerRole?: string): Partial<ExecutionContext> => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({
        headers: { 'x-role': headerRole },
      }),
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        {
          provide: Reflector,
          useValue: { getAllAndOverride: jest.fn() },
        },
      ],
    }).compile();

    guard = module.get<RoleGuard>(RoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('Should pass when did not define guard', () => {
    const context = createMockContext() as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('Should pass when x-role and @Roles are same role', () => {
    const context = createMockContext(Role.ADMIN) as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    const result = guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('Should throw ForbiddenException when no x-role in header', () => {
    const context = createMockContext(undefined) as ExecutionContext;
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Insufficient role'),
    );
  });

  it('Should throw ForbiddenException when x-role and @Roles are not same role', () => {
    const context = createMockContext(Role.USER) as ExecutionContext;
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

    expect(() => guard.canActivate(context)).toThrow(
      new ForbiddenException('Insufficient role'),
    );
  });
});
