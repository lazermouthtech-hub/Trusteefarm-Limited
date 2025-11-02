import { SendGridSettings } from '../types';
import { emailStore } from './emailStore';

export type SendGridTemplate = 
    | 'farmer_welcome' 
    | 'buyer_welcome' 
    | 'subscription_success' 
    | 'farmer_approved' 
    | 'produce_approved';

interface SendEmailParams {
    settings: SendGridSettings;
    recipientEmail: string;
    recipientName: string;
    template: SendGridTemplate;
}

/**
 * Simulates sending a transactional email via SendGrid.
 * This function logs the intended action to the console and adds the email
 * to a local, observable store for UI feedback in the "Simulated Inbox".
 * This provides a safe and realistic testing environment without exposing API keys
 * or requiring a backend.
 */
export const sendTransactionalEmail = async ({
    settings,
    recipientEmail,
    recipientName,
    template,
}: SendEmailParams): Promise<void> => {
    
    console.log(`[SendGrid SIM] Attempting to send '${template}' email...`);

    if (!settings.enabled) {
        console.log('[SendGrid SIM] - Status: SKIPPED (Integration is disabled).');
        return;
    }

    if (!settings.apiKey) {
        console.warn('[SendGrid SIM] - Status: FAILED (API Key is missing in settings).');
        return;
    }
    
    console.log(`[SendGrid SIM] - Using API Key: ${settings.apiKey ? `SG...${settings.apiKey.slice(-4)}` : 'Not Set'}`);

    let templateId: string | undefined;
    switch (template) {
        case 'farmer_welcome': templateId = settings.farmerWelcomeTemplateId; break;
        case 'buyer_welcome': templateId = settings.buyerWelcomeTemplateId; break;
        case 'subscription_success': templateId = settings.subscriptionSuccessTemplateId; break;
        case 'farmer_approved': templateId = settings.farmerApprovedTemplateId; break;
        case 'produce_approved': templateId = settings.produceApprovedTemplateId; break;
        default:
            console.error(`[SendGrid SIM] - Status: FAILED (Unknown email template: ${template})`);
            return;
    }

    if (!templateId) {
        console.warn(`[SendGrid SIM] - Status: FAILED (Template ID for '${template}' is not configured).`);
        return;
    }
    
    const backendPayload = {
        from: {
            email: "noreply@trusteefarm.com",
            name: "Trusteefarm"
        },
        to: {
            email: recipientEmail,
            name: recipientName
        },
        templateId: templateId,
        dynamicTemplateData: {
            recipient_name: recipientName,
            // In a real app, you would add more dynamic data here
            // e.g., login_url, order_details, etc.
        },
    };
    
    // Add to the simulated inbox for local UI testing
    emailStore.addEmail({
        to: `${recipientName} <${recipientEmail}>`,
        template: template,
        payload: backendPayload,
    });
    
    console.log(`[SendGrid SIM] - To: ${recipientName} <${recipientEmail}>`);
    console.log(`[SendGrid SIM] - Template ID: ${templateId}`);
    console.log('[SendGrid SIM] - Payload:', backendPayload);
    console.log(`[SendGrid SIM] ✅ Status: SUCCESS. Email sent to simulated inbox.`);
};