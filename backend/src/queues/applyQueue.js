const applyAgent = require('../agents/apply.agent');

class ApplyQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
    }

    add(job, userProfile, coverLetter) {
        console.log(`[ApplyQueue] Added job ${job.title} to queue.`);
        this.queue.push({ job, userProfile, coverLetter, addedAt: new Date() });
        this.processNext();
    }

    async processNext() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        const task = this.queue.shift();

        try {
            console.log(`[ApplyQueue] Processing: ${task.job.title} at ${task.job.company}`);
            
            // Call the Apply Agent
            await applyAgent.apply(task.job, task.userProfile, task.coverLetter);
            
            // Simulating delay for "Human-like" behavior
            await new Promise(r => setTimeout(r, 5000)); 
            
            console.log(`[ApplyQueue] Success: ${task.job.title}`);
        } catch (error) {
            console.error(`[ApplyQueue] Failed: ${task.job.title}`, error);
        } finally {
            this.processing = false;
            if (this.queue.length > 0) {
                // Rate limit: Wait 10 seconds between applications
                setTimeout(() => this.processNext(), 10000); 
            }
        }
    }

    getStatus() {
        return {
            pending: this.queue.length,
            isProcessing: this.processing
        };
    }
}

module.exports = new ApplyQueue();
