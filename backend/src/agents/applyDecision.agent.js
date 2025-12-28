class ApplyDecisionAgent {
    decide(job) {
        // Rules from rules.txt
        // 1. Email Apply = AUTO
        // 2. Simple Form (<= 3 steps) = AUTO
        // 3. Login/OTP/Captcha = MANUAL

        // Since we are using API data, we might not know form steps yet.
        // We heuristically decide based on URL.

        const manualDomains = ['workday', 'taleo', 'brassring', 'icims'];
        const isComplex = manualDomains.some(d => job.url.includes(d));

        if (isComplex) {
            return { decision: "MANUAL", reason: "Known complex ATS domain" };
        }

        // For MVP, if it's not a known complex ATS, we flag as AUTO-CANDIDATE
        // The Apply Agent will further validate when it opens the page.
        return { decision: "AUTO", reason: "Standard application domain" };
    }
}

module.exports = new ApplyDecisionAgent();
