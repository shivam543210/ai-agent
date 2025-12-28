const jobSearchAgent = require('../src/agents/jobSearch.agent');
const jobApis = require('../src/services/jobApis.service');

// Mock jobApis service
jest.mock('../src/services/jobApis.service');

describe('JobSearchAgent', () => {
    it('should search using the API service and normalize results', async () => {
        // Setup mock response
        const mockRawJobs = [
            {
                job_id: '123',
                job_title: 'Test Developer',
                employer_name: 'Test Co',
                job_description: 'Code things',
                job_apply_link: 'http://test.com',
                job_is_remote: true
            }
        ];
        jobApis.searchJobs.mockResolvedValue(mockRawJobs);

        // Execute
        const results = await jobSearchAgent.search('developer', { location: 'remote' });

        // Verify
        expect(jobApis.searchJobs).toHaveBeenCalledWith('developer', 'remote');
        expect(results).toHaveLength(1);
        expect(results[0].title).toBe('Test Developer');
        expect(results[0].company).toBe('Test Co');
        expect(results[0].isRemote).toBe(true);
    });

    it('should handle empty results', async () => {
        jobApis.searchJobs.mockResolvedValue([]);
        const results = await jobSearchAgent.search('unknown', {});
        expect(results).toEqual([]);
    });
});
