const { prisma } = require('../config/database');
const { verifyToken } = require('../utils/helpers');
const { authenticate, optionalAuth, authorize, checkOwnership } = require('../middlewares/auth');

jest.mock('../config/database', () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    project: { findUnique: jest.fn() },
    review: { findFirst: jest.fn() },
  },
}));

jest.mock('../utils/helpers', () => ({
  verifyToken: jest.fn(),
}));

jest.mock('../utils/logger', () => ({
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
}));

const makeResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('ClipConnect authentication middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('optionalAuth continues anonymously when no bearer token is supplied', async () => {
    const req = { header: jest.fn().mockReturnValue(undefined) };
    const next = jest.fn();

    await optionalAuth(req, makeResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  test('optionalAuth loads an active Prisma user from a valid token', async () => {
    const user = {
      id: 'user-123',
      username: 'editor',
      role: 'EDITOR',
      isActive: true,
      isSuspended: false,
    };
    const req = { header: jest.fn().mockReturnValue('Bearer valid-token') };
    const next = jest.fn();
    verifyToken.mockReturnValue({ userId: user.id });
    prisma.user.findUnique.mockResolvedValue(user);

    await optionalAuth(req, makeResponse(), next);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
      select: expect.objectContaining({ id: true, isActive: true, isSuspended: true }),
    });
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('optionalAuth does not attach suspended users', async () => {
    const req = { header: jest.fn().mockReturnValue('Bearer valid-token') };
    const next = jest.fn();
    verifyToken.mockReturnValue({ id: 'suspended-user' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'suspended-user',
      isActive: true,
      isSuspended: true,
    });

    await optionalAuth(req, makeResponse(), next);

    expect(req.user).toBeUndefined();
    expect(next).toHaveBeenCalledTimes(1);
  });

  test('authenticate rejects suspended users', async () => {
    const req = { header: jest.fn().mockReturnValue('Bearer valid-token') };
    const res = makeResponse();
    const next = jest.fn();
    verifyToken.mockReturnValue({ id: 'suspended-user' });
    prisma.user.findUnique.mockResolvedValue({
      id: 'suspended-user',
      isActive: true,
      isSuspended: true,
    });

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('authorize compares roles without case sensitivity', () => {
    const req = { user: { id: 'user-123', role: 'ADMIN' } };
    const next = jest.fn();

    authorize('admin')(req, makeResponse(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test('checkOwnership recognizes uppercase admin roles', () => {
    const req = { user: { id: 'admin-1', role: 'ADMIN' }, params: { userId: 'other-user' } };
    const res = makeResponse();
    const next = jest.fn();

    checkOwnership()(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
