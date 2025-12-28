const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { smartFill } = require('./llm.service');

puppeteer.use(StealthPlugin());

class PuppeteerService {
    async applyToJob(jobUrl, userProfile, coverLetterText) {
        console.log(`[PuppeteerService] Launching browser for: ${jobUrl}`);
        const browser = await puppeteer.launch({ 
            headless: false, // Headful for applying as per rules.txt
            executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
            userDataDir: './user_data',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        
        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
            await page.goto(jobUrl, { waitUntil: 'networkidle2' });
            
            // Find visible inputs
            const inputs = await page.$$('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea');
            
            for (const input of inputs) {
                const fieldInfo = await input.evaluate(el => {
                    let labelText = "";
                    if (el.id) {
                        const label = document.querySelector(`label[for="${el.id}"]`);
                        if (label) labelText = label.innerText;
                    }
                    if (!labelText) {
                        labelText = el.parentElement ? el.parentElement.innerText.split('\n')[0] : "";
                    }

                    return {
                        name: el.name || "",
                        id: el.id || "",
                        placeholder: el.placeholder || "",
                        type: el.type,
                        label: labelText.substring(0, 100)
                    };
                });

                if (['submit', 'button', 'image', 'reset'].includes(fieldInfo.type)) continue;

                // Handle Cover Letter
                if (fieldInfo.name.toLowerCase().includes('cover') || fieldInfo.label.toLowerCase().includes('cover letter')) {
                    if (coverLetterText) {
                        console.log(`[Smart Fill] Pasting Cover Letter into: ${fieldInfo.name}`);
                        await input.type(coverLetterText);
                        continue;
                    }
                }
                
                if (fieldInfo.type === 'file') {
                     console.log(`[Smart Fill] Skipped file upload: ${fieldInfo.name}`);
                     continue;
                }

                console.log(`[Smart Fill] Analyzing: ${fieldInfo.name || fieldInfo.label}`);
                const valueToType = await smartFill(fieldInfo, userProfile);
                
                if (valueToType && valueToType !== 'N/A') {
                    await input.type(valueToType, { delay: 100 }); // Slow typing
                }
            }
            
            console.log("Form processed. Waiting for manual review/submit...");
            await new Promise(r => setTimeout(r, 15000)); // Give human time to review

        } catch (error) {
            console.error("[PuppeteerService] Error:", error);
            throw error;
        } finally {
            await browser.close();
        }
    }
}

module.exports = new PuppeteerService();
