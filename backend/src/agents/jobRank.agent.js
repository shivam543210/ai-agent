class JobRankAgent {
    rank(jobs, userProfile) {
        console.log(`[JobRankAgent] Ranking ${jobs.length} jobs...`);
        
        const rankedJobs = jobs.map(job => {
            let score = 0;
            const reasons = [];

            // 1. Keyword Match (Simple regex for MVP)
            const skills = userProfile.skills || [];
            let matchCount = 0;
            skills.forEach(skill => {
                if (job.description.toLowerCase().includes(skill.toLowerCase())) {
                    matchCount++;
                }
            });
            // Skill Match (40% weight)
            // Normalize: 5 skills matched = 100% of 40 points -> 40
            const skillScore = Math.min(matchCount * 8, 40);
            score += skillScore;
            if (skillScore > 0) reasons.push(`Matched ${matchCount} skills`);

            // 2. Remote Match (20% weight)
            if (job.isRemote) {
                score += 20;
                reasons.push("Remote match");
            }

            // 3. Title Match (20% weight)
            if (job.title.toLowerCase().includes(userProfile.preferences?.target_role?.toLowerCase() || 'engineer')) {
                score += 20;
                reasons.push("Title match");
            }

            // 4. Ease of Apply (20% weight) -- Placeholder for now
            // If we detected it was an "Easy Apply" (not possible via API often), we'd add points.
            // For now, give 10 points default.
            score += 10;

            return {
                ...job,
                score,
                matchReasons: reasons
            };
        });

        // Sort by score DESC
        return rankedJobs.sort((a, b) => b.score - a.score).slice(0, 10); // Return top 10
    }
}

module.exports = new JobRankAgent();
