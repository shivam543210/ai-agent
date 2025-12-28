const request = require('supertest');
const app = require('../src/server'); // We exported app in Commit 7
const jobApis = require('../src/services/jobApis.service');

jest.mock('../src/services/jobApis.service');

describe('API Integration Tests', () => {
    
    describe('POST /api/jobs/search', () => {
        it('should return 200 and ranked jobs', async () => {
            jobApis.searchJobs.mockResolvedValue([
                {
                    job_title: 'Frontend Dev',
                    employer_name: 'Web Co',
                    job_description: 'React needed',
                    job_apply_link: 'http://apply.com',
                    job_is_remote: true
                }
            ]);

            const res = await request(app)
                .post('/api/jobs/search')
                .send({ query: 'Frontend' });

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].title).toBe('Frontend Dev');
        });
    });

    describe('GET /api-docs', () => {
        it('should return Swagger UI', async () => {
            const res = await request(app).get('/api-docs/');
            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain('Swagger UI');
        });
    });
});
