const axios = require('axios');

class JobApisService {
    constructor() {
        this.jsearchKey = process.env.JSEARCH_API_KEY; // RapidAPI JSearch
    }

    async searchJobs(query, location = 'remote') {
        // MOCK fallback if no key (Safety first per rules.txt)
        if (!this.jsearchKey) {
            console.warn("JobApisService: No API Key provided. Returning mock data.");
            return this.getMockJobs(query);
        }

        try {
            const options = {
                method: 'GET',
                url: 'https://jsearch.p.rapidapi.com/search',
                params: {
                    query: `${query} in ${location}`,
                    page: '1',
                    num_pages: '1'
                },
                headers: {
                    'X-RapidAPI-Key': this.jsearchKey,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);
            return response.data.data;

        } catch (error) {
            console.error("JobApisService Error:", error.message);
            return [];
        }
    }

    getMockJobs(query) {
        return [
            {
                job_title: `${query} Developer`,
                employer_name: "Mock Company A",
                job_description: "This is a mock job for testing safely.",
                job_apply_link: "https://example.com/apply",
                job_is_remote: true
            },
            {
                job_title: `Senior ${query} Engineer`,
                employer_name: "Mock Company B",
                job_description: "Another mock job.",
                job_apply_link: "https://example.com/apply-2",
                job_is_remote: false
            }
        ];
    }
}

module.exports = new JobApisService();
