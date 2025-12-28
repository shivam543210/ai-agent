const applyDecisionAgent = require('./applyDecision.agent');
const puppeteerService = require('../services/puppeteer.service');
const emailService = require('../services/email.service'); // We need to create this stub

class ApplyAgent {
    async apply(job, userProfile, coverLetter) {
        console.log(`[ApplyAgent] Received job: ${job.title}`);

        // 1. Decide how to apply
        const decision = applyDecisionAgent.decide(job);
        console.log(`[ApplyAgent] Decision: ${decision.decision} (${decision.reason})`);

        if (decision.decision === "MANUAL") {
            console.log("[ApplyAgent] Manual intervention required. Skipping auto-apply.");
            return { status: "skipped", reason: "manual_required" };
        }

        // 2. Execute Strategy
        try {
            // Priority: Email > Browser
            // For now, we assume browser based on legacy code, unless email is detected in future.
            await puppeteerService.applyToJob(job.url, userProfile, coverLetter);
            return { status: "success" };
        } catch (e) {
            console.error("[ApplyAgent] Application failed:", e);
            return { status: "failed", error: e.message };
        }
    }
}

module.exports = new ApplyAgent();
