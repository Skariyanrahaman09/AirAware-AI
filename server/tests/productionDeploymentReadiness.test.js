const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB, getDatabaseStatus, sanitizeMongoUri } = require('../src/config/database');

describe('Production Deployment Readiness Suite', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('Health Endpoints (/api/health and /health)', () => {
    test('GET /api/health returns healthy status with database connection info', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status');
      expect(res.body).toHaveProperty('database');
      expect(res.body).toHaveProperty('uptimeSeconds');
      expect(res.body).toHaveProperty('service', 'AirAware AI Backend');
      expect(res.body).toHaveProperty('version');
    });

    test('GET /health alias returns healthy status for cloud platform monitoring', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('AirAware AI Backend');
    });
  });

  describe('Reverse Proxy Trust Configuration', () => {
    test('Express app has trust proxy enabled for Render / cloud load balancers', () => {
      expect(app.get('trust proxy')).toBe(1);
    });
  });

  describe('Production Database Safety Guardrails', () => {
    const originalEnv = process.env.NODE_ENV;
    const originalMongoUri = process.env.MONGO_URI;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      process.env.MONGO_URI = originalMongoUri;
    });

    test('strictly refuses to launch without MONGO_URI in production mode', async () => {
      process.env.NODE_ENV = 'production';
      delete process.env.MONGO_URI;

      await expect(connectDB()).rejects.toThrow(
        /MONGO_URI is required in production mode/
      );
    });

    test('safely sanitizes credentials when logging MongoDB URIs', () => {
      const rawUri = 'mongodb+srv://adminUser:SuperSecretPassword123@cluster0.abcde.mongodb.net/airaware';
      const sanitized = sanitizeMongoUri(rawUri);

      expect(sanitized).not.toContain('SuperSecretPassword123');
      expect(sanitized).toContain('adminUser:****@');
      expect(sanitized).toContain('cluster0.abcde.mongodb.net');
    });

    test('getDatabaseStatus reports state accurately', () => {
      const status = getDatabaseStatus();
      expect(['connected', 'connecting', 'disconnected', 'disconnecting']).toContain(status);
    });
  });

  describe('Production CORS Policy Restrictions', () => {
    test('validates and accepts configured origin headers', async () => {
      const res = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
      expect(res.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});
