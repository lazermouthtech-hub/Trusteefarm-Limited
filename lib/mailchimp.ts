import { MailchimpSettings } from '../types';

type MailchimpTemplate = 
    | 'farmer_welcome' 
    | 'buyer_welcome' 
    | 'subscription_success' 
    | 'farmer_approved' 
    | 'produce_approved';

interface SendEmailParams {
    settings: MailchimpSettings;
    recipientEmail: string;
    recipientName: string;
    template: MailchimpTemplate;
}

/**
 * Simulates sending a transactional email via Mailchimp.
 * In a real-world application, this function would live on a server/backend
 * and make a secure API call to the Mailchimp Transactional Email API.
 * For this frontend-only app, we log the action to the console for demonstration.
 */
export const sendTransactionalEmail = async ({
    settings,
    recipientEmail,
    recipientName,
    template,
}: SendEmailParams): Promise<void> => {
    
    if (!settings.enabled) {
        console.log('[Mailchimp SIM] Integration is disabled. Skipping email.');
        return;
    }

    if (!settings.apiKey || !settings.serverPrefix) {
        console.warn('[Mailchimp SIM] API Key or Server Prefix is missing. Cannot send email.');
        return;
    }

    let templateId: string | undefined;
    switch (template) {
        case 'farmer_welcome':
            templateId = settings.farmerWelcomeTemplateId;
            break;
        case 'buyer_welcome':
            templateId = settings.buyerWelcomeTemplateId;
            break;
        case 'subscription_success':
            templateId = settings.subscriptionSuccessTemplateId;
            break;
        case 'farmer_approved':
            templateId = settings.farmerApprovedTemplateId;
            break;
        case 'produce_approved':
            templateId = settings.produceApprovedTemplateId;
            break;
        default:
            console.error(`[Mailchimp SIM] Unknown email template: ${template}`);
            return;
    }

    if (!templateId) {
        console.warn(`[Mailchimp SIM] Template ID for '${template}' email is not configured. Cannot send email.`);
        return;
    }

    // --- This is where the actual backend API call would be ---
    // For now, we just log the intended action to the console.
    
    const payload = {
        template_name: templateId,
        template_content: [], // Dynamic content for merge tags would go here
        message: {
            to: [{ email: recipientEmail, name: recipientName, type: 'to' }],
            // ... other message options like from_email, subject, etc.
        },
    };

    console.log(`[Mailchimp SIM] Preparing to send '${template}' email...`);
    console.log(` > To: ${recipientName} <${recipientEmail}>`);
    console.log(` > Using Template ID: ${templateId}`);
    console.log(' > Payload (for backend):', JSON.stringify(payload, null, 2));
    console.log(`[Mailchimp SIM] ✅ Email sent successfully (simulated).`);

    // Example of what a real fetch call might look like on a server:
    /*
    const response = await fetch(`https://${settings.serverPrefix}.api.mailchimp.com/3.0/messages/send-template`, {
        method: 'POST',
        headers: {
            'Authorization': `apikey ${settings.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('[Mailchimp REAL] Failed to send email:', errorData);
    }
    */
};