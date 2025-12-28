const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/error.middleware');

// Agents & Queues
const jobSearchAgent = require('./agents/jobSearch.agent');
const jobRankAgent = require('./agents/jobRank.agent');
const applyQueue = require('./queues/applyQueue');
const llmService = require('./services/llm.service');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Request Logging Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - ${req.ip}`);
    next();
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


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

/**
 * @swagger
 * /api/jobs/search:
 *   post:
 *     summary: Search for jobs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *     responses:
 *       200:
 *         description: List of ranked jobs
 */
app.post('/api/jobs/search', async (req, res, next) => {
    const { query } = req.body;
    try {
        logger.info(`[API] Search request for: ${query}`);
        
        // A. Search
        const jobs = await jobSearchAgent.search(query, { location: 'remote' });
        
        // B. Rank
        const rankedJobs = jobRankAgent.rank(jobs, userProfile);
        
        res.json(rankedJobs);
    } catch (error) {
        next(error); // Pass to Error Handler
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

// 404 Handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        logger.info(`Backend server (Agent Architecture) running on http://localhost:${PORT}`);
        logger.info(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
    });
}

module.exports = app; // For testing
