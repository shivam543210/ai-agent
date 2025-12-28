const jobApis = require('../services/jobApis.service');

class JobSearchAgent {
    async search(query, userPreferences) {
        console.log(`[JobSearchAgent] Searching for "${query}"...`);
        
        // 1. Fetch raw jobs from API
        const rawJobs = await jobApis.searchJobs(query, userPreferences.location || 'remote');
        
        // 2. Normalize Data
        const normalizedJobs = rawJobs.map(job => ({
            id: job.job_id || Math.random().toString(36).substr(2, 9),
            title: job.job_title,
            company: job.employer_name,
            description: job.job_description,
            url: job.job_apply_link,
            isRemote: job.job_is_remote,
            postedAt: job.job_posted_at_datetime_utc,
            // Add raw data for other agents
            raw: job
        }));

        console.log(`[JobSearchAgent] Found ${normalizedJobs.length} jobs.`);
        return normalizedJobs;
    }
}

module.exports = new JobSearchAgent();
