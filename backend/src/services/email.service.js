class EmailService {
    async sendApplication(to, subject, body, attachments) {
        console.log(`[EmailService] Would send email to ${to} with subject "${subject}"`);
        // Implementation stub for nodemailer or similar
        return true;
    }
}

module.exports = new EmailService();
