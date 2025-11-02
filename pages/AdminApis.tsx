import React, { useState, useEffect } from 'react';
import { PlugZap, Terminal, BookOpen, KeyRound, Eye, EyeOff, Copy, Check, CreditCard, Save, AlertCircle, ToggleLeft, ToggleRight, Settings, Mail, Send } from 'lucide-react';
import { SystemSettings, PaystackSettings, PaymentSettings, SendGridSettings } from '../types';
import { classNames } from '../lib/utils';
import { sendTransactionalEmail, SendGridTemplate } from '../lib/sendgrid';


interface AdminApisProps {
    settings: SystemSettings;
    onUpdateSettings: (newSettings: SystemSettings) => void;
}

const TestSendGridEmailModal = ({ isOpen, onClose, templateName, templateType, settings, onSend }: { isOpen: boolean, onClose: () => void, templateName: string, templateType: SendGridTemplate | null, settings: SendGridSettings, onSend: (name: string, email: string) => void }) => {
    const [name, setName] = useState('Jude Beyou');
    const [email, setEmail] = useState('judebeyou@yahoo.com');
    const [isSent, setIsSent] = useState(false);

    const keyMap: Record<SendGridTemplate, keyof SendGridSettings> = {
        'farmer_welcome': 'farmerWelcomeTemplateId',
        'buyer_welcome': 'buyerWelcomeTemplateId',
        'subscription_success': 'subscriptionSuccessTemplateId',
        'farmer_approved': 'farmerApprovedTemplateId',
        'produce_approved': 'produceApprovedTemplateId'
    };
    
    const templateId = templateType ? settings[keyMap[templateType]] as string : '';

    useEffect(() => {
        if (isOpen) {
            setIsSent(false);
        }
    }, [isOpen, templateId]);

    if (!isOpen) return null;

    const handleSend = () => {
        onSend(name, email);
        setIsSent(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
                <div className="p-5 border-b dark:border-gray-600">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Test '{templateName}' Email</h3>
                </div>
                <div className="p-6 space-y-4">
                    {isSent ? (
                        <div className="text-center">
                            <Check className="h-12 w-12 mx-auto text-green-500" />
                            <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">Test email sent (simulated)!</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Check the Simulated Inbox at the bottom-right of the screen.</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600 dark:text-gray-300">This will simulate sending an email using the template ID: <strong>{templateId || '[Not Set]'}</strong></p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-900 bg-gray-200 dark:bg-gray-700 dark:border-gray-500 dark:text-white appearance-none"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recipient Email</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full p-2 border rounded-md text-gray-900 bg-gray-200 dark:bg-gray-700 dark:border-gray-500 dark:text-white appearance-none"/>
                            </div>
                        </>
                    )}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-2">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Close</button>
                    {!isSent && <button onClick={handleSend} disabled={!templateId} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"><Send className="h-4 w-4 mr-2"/>Send Test</button>}
                </div>
            </div>
        </div>
    );
};


const AdminApis = ({ settings, onUpdateSettings }: AdminApisProps) => {
  // Gemini Key State
  const geminiApiKey = process.env.API_KEY; 
  const [isGeminiKeyVisible, setIsGeminiKeyVisible] = useState(false);

  // Paystack Keys State
  const [paystackConfig, setPaystackConfig] = useState<PaystackSettings>(settings.paymentSettings.paystack);
  const [activeGateway, setActiveGateway] = useState<PaymentSettings['activeGateway']>(settings.paymentSettings.activeGateway);
  const [isTestSecretVisible, setIsTestSecretVisible] = useState(false);
  const [isLiveSecretVisible, setIsLiveSecretVisible] = useState(false);

  // SendGrid State
  const [sendGridConfig, setSendGridConfig] = useState<SendGridSettings>(settings.sendGridSettings);
  const [isSendGridKeyVisible, setIsSendGridKeyVisible] = useState(false);

  // General UI State
  const [copyStatus, setCopyStatus] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<'success' | ''>('');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testTemplate, setTestTemplate] = useState<{ name: string, type: SendGridTemplate } | null>(null);
  
  // Sync local state if props change from outside
  useEffect(() => {
    setPaystackConfig(settings.paymentSettings.paystack);
    setActiveGateway(settings.paymentSettings.activeGateway);
    setSendGridConfig(settings.sendGridSettings);
  }, [settings]);

  const handlePaystackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaystackConfig(prev => ({...prev, [name]: value}));
  };
  
  const handleSendGridChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSendGridConfig(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCopyToClipboard = (text: string, key: string) => {
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        setCopyStatus({ [key]: true });
        setTimeout(() => setCopyStatus({}), 2000);
      });
    }
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
        ...settings,
        paymentSettings: {
            activeGateway,
            paystack: paystackConfig,
        },
        sendGridSettings: sendGridConfig,
    });
    setSaveStatus('success');
    setTimeout(() => setSaveStatus(''), 3000);
  };
  
  const handleOpenTestModal = (name: string, type: SendGridTemplate) => {
    setTestTemplate({ name, type });
    setIsTestModalOpen(true);
  };
  
  const handleSendTestEmail = (recipientName: string, recipientEmail: string) => {
    if (testTemplate) {
        sendTransactionalEmail({
            settings: sendGridConfig,
            recipientEmail,
            recipientName,
            template: testTemplate.type,
        });
    }
  };

  const maskedGeminiKey = geminiApiKey ? `${geminiApiKey.substring(0, 4)}........................${geminiApiKey.substring(geminiApiKey.length - 4)}` : 'No API Key Found';
  const displayedGeminiKey = isGeminiKeyVisible ? geminiApiKey : maskedGeminiKey;

  const KeyInput = ({ label, id, value, onChange, isVisible, onToggleVisibility, onCopy, helpText, placeholder, isSecret = true }: any) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm border dark:border-gray-500">
            <input
                id={id}
                name={id}
                type={isSecret && !isVisible ? 'password' : 'text'}
                value={value}
                onChange={onChange}
                placeholder={placeholder || `${isSecret ? 'sk' : 'pk'}_...`}
                className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-mono text-gray-600 dark:text-gray-300 placeholder-gray-400"
            />
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                {isSecret && (
                    <button type="button" onClick={onToggleVisibility} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-600" title="Toggle Visibility">
                        {isVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
                <button type="button" onClick={() => onCopy(value, id)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-600" title="Copy Key">
                    {copyStatus[id] ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
            </div>
        </div>
        {helpText && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>}
    </div>
  );
  
  const TemplateIdInput = ({ label, id, value, onChange, helpText, placeholder, onTest }: any) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm border dark:border-gray-500">
            <input
                id={id}
                name={id}
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-600 dark:text-gray-300 placeholder-gray-400"
            />
             <button type="button" onClick={onTest} className="ml-2 flex-shrink-0 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold py-1 px-2 rounded">Test</button>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <PlugZap className="h-10 w-10 text-primary-600" />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">API Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and view your integration API keys and payment gateways.</p>
          </div>
        </div>
      </div>

       <form onSubmit={handleSave} className="space-y-6">
            {/* Payment Gateway Settings */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-4">
                    <Settings className="h-5 w-5 mr-2 text-primary-500" />
                    Payment Gateway Configuration
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Active Gateway</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select the payment provider for buyer subscriptions.</p>
                        <select
                            value={activeGateway}
                            onChange={(e) => setActiveGateway(e.target.value as any)}
                            className="w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        >
                            <option value="paystack">Paystack</option>
                            <option value="none">None (Disabled)</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Paystack Mode</label>
                         <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Use test keys for development or live keys for real transactions.</p>
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-md">
                            <button
                                type="button"
                                onClick={() => setPaystackConfig(p => ({...p, mode: 'test'}))}
                                className={classNames('flex-1 py-1 rounded-md text-sm font-semibold', paystackConfig.mode === 'test' ? 'bg-white dark:bg-gray-800 shadow text-primary-600' : 'text-gray-600 dark:text-gray-300')}
                            >Test Mode</button>
                            <button
                                type="button"
                                onClick={() => setPaystackConfig(p => ({...p, mode: 'live'}))}
                                className={classNames('flex-1 py-1 rounded-md text-sm font-semibold', paystackConfig.mode === 'live' ? 'bg-white dark:bg-gray-800 shadow text-primary-600' : 'text-gray-600 dark:text-gray-300')}
                            >Live Mode</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center">
                <Terminal className="h-5 w-5 mr-2 text-primary-500" />
                API Keys
              </h2>
              <div className="mt-4 space-y-6">
                
                {/* Paystack API Keys */}
                 <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                    Paystack API Keys
                  </h3>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Used for processing payments from buyers.</p>
                  <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <KeyInput label="Test Public Key" id="testPublicKey" value={paystackConfig.testPublicKey} onChange={handlePaystackChange} onCopy={handleCopyToClipboard} helpText="Used on the frontend to initiate payments." placeholder={`pk_test_...`} isSecret={false} />
                    <KeyInput label="Test Secret Key" id="testSecretKey" value={paystackConfig.testSecretKey} onChange={handlePaystackChange} isVisible={isTestSecretVisible} onToggleVisibility={() => setIsTestSecretVisible(!isTestSecretVisible)} onCopy={handleCopyToClipboard} helpText="Used on your server to securely verify payments." placeholder={`sk_test_...`} />
                    <KeyInput label="Live Public Key" id="livePublicKey" value={paystackConfig.livePublicKey} onChange={handlePaystackChange} onCopy={handleCopyToClipboard} helpText="Used on the frontend for real transactions." placeholder={`pk_live_...`} isSecret={false}/>
                    <KeyInput label="Live Secret Key" id="liveSecretKey" value={paystackConfig.liveSecretKey} onChange={handlePaystackChange} isVisible={isLiveSecretVisible} onToggleVisibility={() => setIsLiveSecretVisible(!isLiveSecretVisible)} onCopy={handleCopyToClipboard} helpText="Used on your server for secure, live payments." placeholder={`sk_live_...`}/>
                  </div>
                </div>

                {/* SendGrid API */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                SendGrid API
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Manage transactional emails for user events.</p>
                        </div>
                         <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2">Enable</span>
                            <button type="button" onClick={() => setSendGridConfig(c => ({...c, enabled: !c.enabled}))} className={classNames(sendGridConfig.enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500')}>
                                <span className={classNames(sendGridConfig.enabled ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200')}/>
                            </button>
                        </div>
                    </div>
                    <div className="mt-4 space-y-6">
                        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-blue-400" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Email Simulation Mode</h3>
                                    <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                        <p>For security, this application does not send real emails from the browser. When you click "Test", a simulated email will be generated and will appear in the <strong className="font-semibold">Simulated Inbox widget</strong> at the bottom-right of your screen.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <KeyInput 
                            label="SendGrid API Key" 
                            id="apiKey" 
                            value={sendGridConfig.apiKey} 
                            onChange={handleSendGridChange}
                            isVisible={isSendGridKeyVisible} 
                            onToggleVisibility={() => setIsSendGridKeyVisible(!isSendGridKeyVisible)} 
                            onCopy={handleCopyToClipboard} 
                            helpText="Find this in your SendGrid account under Settings > API Keys."
                            placeholder="SG.xxxxxxxxxxxxxxxxxxxxxx..."
                        />
                        <div>
                            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Transactional Email Templates</h4>
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                               <TemplateIdInput
                                    label="Farmer Welcome Email"
                                    id="farmerWelcomeTemplateId"
                                    value={sendGridConfig.farmerWelcomeTemplateId}
                                    onChange={handleSendGridChange}
                                    placeholder="e.g., d-xxxxxxxxxxxxxxxx"
                                    helpText="For new farmer registrations."
                                    onTest={() => handleOpenTestModal('Farmer Welcome', 'farmer_welcome')}
                                />
                                <TemplateIdInput
                                    label="Buyer Welcome Email"
                                    id="buyerWelcomeTemplateId"
                                    value={sendGridConfig.buyerWelcomeTemplateId}
                                    onChange={handleSendGridChange}
                                    placeholder="e.g., d-xxxxxxxxxxxxxxxx"
                                    helpText="For new buyer registrations."
                                    onTest={() => handleOpenTestModal('Buyer Welcome', 'buyer_welcome')}
                                />
                                <TemplateIdInput
                                    label="Subscription Success"
                                    id="subscriptionSuccessTemplateId"
                                    value={sendGridConfig.subscriptionSuccessTemplateId}
                                    onChange={handleSendGridChange}
                                    placeholder="e.g., d-xxxxxxxxxxxxxxxx"
                                    helpText="For when a buyer successfully subscribes."
                                    onTest={() => handleOpenTestModal('Subscription Success', 'subscription_success')}
                                />
                                <TemplateIdInput
                                    label="Farmer Approved"
                                    id="farmerApprovedTemplateId"
                                    value={sendGridConfig.farmerApprovedTemplateId}
                                    onChange={handleSendGridChange}
                                    placeholder="e.g., d-xxxxxxxxxxxxxxxx"
                                    helpText="For when an admin approves a farmer."
                                    onTest={() => handleOpenTestModal('Farmer Approved', 'farmer_approved')}
                                />
                                <TemplateIdInput
                                    label="Produce Approved"
                                    id="produceApprovedTemplateId"
                                    value={sendGridConfig.produceApprovedTemplateId}
                                    onChange={handleSendGridChange}
                                    placeholder="e.g., d-xxxxxxxxxxxxxxxx"
                                    helpText="For when an admin approves a produce listing."
                                    onTest={() => handleOpenTestModal('Produce Approved', 'produce_approved')}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                 {/* Gemini API Key */}
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                        <KeyRound className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                        Gemini API Key
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Used for AI-powered features like OCR and data mapping.</p>
                    </div>
                     <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Active
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm border dark:border-gray-500">
                    <code className="text-sm font-mono text-gray-600 dark:text-gray-300 break-all">
                      {displayedGeminiKey}
                    </code>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <button type="button" onClick={() => setIsGeminiKeyVisible(!isGeminiKeyVisible)} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-600" title={isGeminiKeyVisible ? 'Hide Key' : 'Show Key'}>
                        {isGeminiKeyVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                       <button type="button" onClick={() => handleCopyToClipboard(geminiApiKey || '', 'gemini')} className="p-2 text-gray-500 hover:text-gray-800 dark:hover:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-600" title="Copy Key">
                        {copyStatus['gemini'] ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-end items-center">
                {saveStatus === 'success' && <p className="text-sm text-green-600 mr-4">Settings saved successfully!</p>}
                <button type="submit" className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md text-sm shadow-sm">
                    <Save className="mr-2 h-4 w-4"/>
                    Save All Settings
                </button>
            </div>
       </form>
       <TestSendGridEmailModal 
            isOpen={isTestModalOpen}
            onClose={() => setIsTestModalOpen(false)}
            templateName={testTemplate?.name || ''}
            templateType={testTemplate?.type || null}
            settings={sendGridConfig}
            onSend={handleSendTestEmail}
       />
    </div>
  );
};

export default AdminApis;