const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Agents & Queues
const jobSearchAgent = require('./agents/jobSearch.agent');
const jobRankAgent = require('./agents/jobRank.agent');
const applyQueue = require('./queues/applyQueue');
const llmService = require('./services/llm.service');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Load User Profile
let userProfile = {};
const profilePath = path.join(__dirname, '../user_profile.json');
try {
    const data = fs.readFileSync(profilePath, 'utf8');
    userProfile = JSON.parse(data);
    console.log("User Profile loaded.");
} catch (e) {
    console.error(`Could not load user_profile.json from ${profilePath}`);
}

// Routes

// 1. Search & Rank
app.post('/api/jobs/search', async (req, res) => {
    const { query } = req.body;
    try {
        console.log(`[API] Search request for: ${query}`);
        
        // A. Search
        const jobs = await jobSearchAgent.search(query, { location: 'remote' });
        
        // B. Rank
        const rankedJobs = jobRankAgent.rank(jobs, userProfile);
        
        res.json(rankedJobs);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ error: "Failed to search jobs" });
    }
});

// 2. Apply (via Queue)
app.post('/api/jobs/apply', async (req, res) => {
    const { job } = req.body;
    try {
        console.log(`[API] Apply request for: ${job.title}`);
        
        // A. Generate Cover Letter (LLM Service)
        // We do this *before* queueing to save state, or we could do it in the agent.
        // For now, let's generate it here as per previous flow, or delegate to agent?
        // Rules say "CoverLetterAgent". Let's assume we do it here for MVP simplicity or create CoverLetterAgent.
        // Let's use llmService directly for now as CoverLetterAgent.
        
        let coverLetter = "";
        try {
            coverLetter = await llmService.generateCoverLetter(job.description, {
                name: userProfile.personal_info?.full_name || "Candidate",
                email: userProfile.personal_info?.email || "",
                phone: userProfile.personal_info?.phone || ""
            });
        } catch(e) {
            console.warn("Cover letter generation failed, proceeding without/generic.");
            coverLetter = "To Hiring Manager, I am interested in this role.";
        }

        // B. Add to Queue
        applyQueue.add(job, userProfile, coverLetter);
        
        res.json({ success: true, message: "Application queued successfully" });
    } catch (error) {
        console.error("Apply error:", error);
        res.status(500).json({ error: "Failed to queue application" });
    }
});

app.get('/api/profile', (req, res) => {
    res.json(userProfile);
});

app.listen(PORT, () => {
    console.log(`Backend server (Agent Architecture) running on http://localhost:${PORT}`);
});
