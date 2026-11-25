const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');

const valid = { name: 'Asha Rao', email: 'asha@example.com', password: 'correct-horse-9' };
const post = (path, body) => request(app).post(`/api/auth/${path}`).send(body);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('auth validation', () => {
  test.each([
    ['missing fields', {}],
    ['invalid email', { ...valid, email: 'not-an-email' }],
    ['short password', { ...valid, password: '1234567' }],
    ['password over 72 chars', { ...valid, password: 'x'.repeat(73) }],
    ['non-string password (type confusion)', { ...valid, password: { $ne: null } }],
    ['non-string email (NoSQL-style payload)', { ...valid, email: { $gt: '' } }],
  ])('register rejects %s with 400', async (_label, body) => {
    const res = await post('register', body);
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('login rejects non-string credentials with 400, not 500', async () => {
    const res = await post('login', { email: { $ne: null }, password: { $ne: null } });
    expect(res.status).toBe(400);
  });
});

describe('auth behaviour', () => {
  test('ignores a client-supplied role (no mass assignment)', async () => {
    const res = await post('register', { ...valid, email: 'role@example.com', role: 'admin' });
    expect(res.status).toBe(201);
    expect(res.body.user.role).not.toBe('admin');
  });

  test('normalises email case so login works with any casing', async () => {
    await post('register', { ...valid, email: 'Mixed.Case@Example.com' });
    const res = await post('login', { email: 'mixed.case@example.com', password: valid.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('duplicate email (any casing) returns 409', async () => {
    await post('register', { ...valid, email: 'dup@example.com' });
    const res = await post('register', { ...valid, email: 'DUP@example.com' });
    expect(res.status).toBe(409);
  });

  test('unknown email and wrong password are indistinguishable', async () => {
    await post('register', { ...valid, email: 'known@example.com' });
    const wrongPassword = await post('login', { email: 'known@example.com', password: 'wrong-password' });
    const unknownEmail = await post('login', { email: 'nobody@example.com', password: 'wrong-password' });
    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
  });

  test('response never includes the password hash', async () => {
    const res = await post('register', { ...valid, email: 'safe@example.com' });
    expect(JSON.stringify(res.body)).not.toMatch(/password/i);
  });
});
