const request = require('supertest');
const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/database');
const User = require('../src/models/User');

describe('AirAware AI API Integration Tests', () => {
  let authToken = null;
  let testUserEmail = `tester_${Date.now()}@airaware.test`;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  describe('Health Check API', () => {
    test('GET /api/health should return healthy status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body.service).toBe('AirAware AI Backend');
    });
  });

  describe('Air Quality APIs', () => {
    test('GET /api/air-quality/current should return current AQI & pollutant metrics', async () => {
      const res = await request(app).get('/api/air-quality/current?city=Delhi');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('city');
      expect(res.body.data).toHaveProperty('aqi');
      expect(res.body.data).toHaveProperty('pollutants');
      expect(res.body.data).toHaveProperty('weather');
      expect(res.body.data).toHaveProperty('hourlyTrends');
    });

    test('GET /api/air-quality/forecast should return 5-day environmental forecast', async () => {
      const res = await request(app).get('/api/air-quality/forecast?city=Delhi');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.forecastDays.length).toBe(5);
    });
  });

  describe('Routines and Guides APIs', () => {
    test('POST /api/routines/generate should generate context-aware daily routine', async () => {
      const res = await request(app)
        .post('/api/routines/generate')
        .send({
          city: 'Delhi',
          lifestyle: 'office_worker',
          commuteMode: 'personal_car',
          hasChildren: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.routine).toBeDefined();
      expect(res.body.routine.timeline).toHaveLength(4);
    });

    test('GET /api/routines/indoor-guide should return particle vs gas guidance and budget alternatives', async () => {
      const res = await request(app).get('/api/routines/indoor-guide');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.guide.particulateVsGaseousGuide).toBeDefined();
      expect(res.body.guide.budgetFriendlyAlternatives.length).toBeGreaterThan(0);
    });

    test('GET /api/routines/sustainable-lifestyle should return lifestyle tips', async () => {
      const res = await request(app).get('/api/routines/sustainable-lifestyle');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.tips.length).toBeGreaterThan(0);
    });
  });

  describe('Sustainability Impact Calculator API', () => {
    test('POST /api/impact/calculate should return emissions avoided and fuel savings', async () => {
      const res = await request(app)
        .post('/api/impact/calculate')
        .send({
          commuteDistanceKm: 18,
          daysPerWeek: 5,
          currentMode: 'personal_car',
          alternativeMode: 'public_transit',
          avoidIdling: true,
          combineTrips: true,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.summary.totalAnnualCO2AvoidedKg).toBeGreaterThan(0);
      expect(res.body.scientificDisclaimer).toBeDefined();
    });
  });

  describe('AI Assistant APIs', () => {
    test('POST /api/ai/chat should return structured recommendations and reasoning', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({
          query: 'What should my family do during severe smog?',
          city: 'Delhi',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.response).toHaveProperty('airQualitySummary');
      expect(res.body.response).toHaveProperty('recommendedActions');
      expect(res.body.response).toHaveProperty('indoorSafetyTips');
      expect(res.body.response).toHaveProperty('lowEmissionAlternatives');
      expect(res.body.response).toHaveProperty('healthPrecautions');
    });

    test('POST /api/ai/recommendations should return personalized dashboard recommendations', async () => {
      const res = await request(app)
        .post('/api/ai/recommendations')
        .send({
          city: 'Delhi',
          lifestyle: 'family',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('airQualitySummary');
    });

    test('POST /api/ai/chat should reject empty query', async () => {
      const res = await request(app).post('/api/ai/chat').send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Community Hub APIs', () => {
    test('GET /api/community/posts should return community posts list', async () => {
      const res = await request(app).get('/api/community/posts');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.posts)).toBe(true);
      expect(res.body.posts.length).toBeGreaterThan(0);
    });

    test('POST /api/community/posts should create new tip', async () => {
      const res = await request(app)
        .post('/api/community/posts')
        .send({
          title: 'Seal bedroom draft with rolled damp towel',
          content: 'Simple hack to block cold winter particulate intrusion without spending money.',
          category: 'indoor_hack',
          authorName: 'Eco Tester',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.post.title).toContain('Seal bedroom draft');
    });
  });

  describe('Authentication & Family Profile Flow', () => {
    test('POST /api/auth/register should create user and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: testUserEmail,
          password: 'Password123!',
          city: 'Delhi',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testUserEmail);
      authToken = res.body.token;
    });

    test('POST /api/auth/login should authenticate with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserEmail,
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUserEmail,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('GET /api/family/profile should return user profile with auth header', async () => {
      const res = await request(app)
        .get('/api/family/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile).toBeDefined();
    });

    test('PUT /api/family/profile should update user profile', async () => {
      const res = await request(app)
        .put('/api/family/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          memberCount: 5,
          hasChildren: true,
          hasElderly: true,
          hasAsthmaOrRespiratory: true,
          commuteType: 'public_transit',
          dailyCommuteDistanceKm: 22,
          homeVentilation: 'poor',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.profile.memberCount).toBe(5);
      expect(res.body.profile.hasAsthmaOrRespiratory).toBe(true);
    });

    test('GET /api/family/profile should reject unauthenticated request', async () => {
      const res = await request(app).get('/api/family/profile');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Error Handling Middleware', () => {
    test('should return 404 for unmapped routes', async () => {
      const res = await request(app).get('/api/non-existent-route-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('API endpoint not found');
    });
  });
});
