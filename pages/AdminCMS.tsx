import React from 'react';
import { SystemSettings, HomePageContent } from '../types';
import { ChevronDown, Save, CheckCircle } from 'lucide-react';
import { classNames } from '../lib/utils';

interface AdminCMSProps {
    settings: SystemSettings;
    onUpdateSettings: (newSettings: SystemSettings) => void;
}

interface AccordionItemProps {
    title: string;
    // FIX: Made children optional to resolve TypeScript errors where the compiler incorrectly reported it as missing.
    children?: React.ReactNode;
}

const AccordionItem = ({ title, children }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="border border-gray-200 rounded-lg">
            <h2>
                <button
                    type="button"
                    className="flex items-center justify-between w-full p-5 font-medium text-left text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span>{title}</span>
                    <ChevronDown className={classNames("w-6 h-6 transform transition-transform", isOpen ? "rotate-180" : "")} />
                </button>
            </h2>
            {isOpen && (
                <div className="p-5 border-t">
                    {children}
                </div>
            )}
        </div>
    );
};

const AdminCMS = ({ settings, onUpdateSettings }: AdminCMSProps) => {
    const [content, setContent] = React.useState<HomePageContent>(settings.homePageContent);
    const [showSuccess, setShowSuccess] = React.useState(false);
    
    const handleInputChange = <T extends keyof HomePageContent, K extends keyof HomePageContent[T]>(
        section: T,
        field: K,
        value: HomePageContent[T][K]
    ) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = () => {
        onUpdateSettings({ ...settings, homePageContent: content });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const inputStyle = "mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-primary-500 sm:text-sm";
    const textareaStyle = `${inputStyle} min-h-[100px]`;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm sticky top-0 z-10">
                <h1 className="text-2xl font-bold text-gray-800">Homepage Content Editor</h1>
                <div className="flex items-center space-x-4">
                     {showSuccess && (
                        <div className="flex items-center text-green-600 transition-opacity duration-300">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>Changes saved successfully!</span>
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md shadow-sm"
                    >
                        <Save className="mr-2 h-5 w-5" />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                <AccordionItem title="Hero Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={content.hero.title} onChange={e => handleInputChange('hero', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                            <textarea value={content.hero.subtitle} onChange={e => handleInputChange('hero', 'subtitle', e.target.value)} className={textareaStyle}></textarea>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Primary Button Text</label>
                                <input type="text" value={content.hero.primaryCta} onChange={e => handleInputChange('hero', 'primaryCta', e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Secondary Button Text</label>
                                <input type="text" value={content.hero.secondaryCta} onChange={e => handleInputChange('hero', 'secondaryCta', e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                    </div>
                </AccordionItem>
                
                 <AccordionItem title="Mission Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={content.mission.title} onChange={e => handleInputChange('mission', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Text</label>
                            <textarea value={content.mission.text} onChange={e => handleInputChange('mission', 'text', e.target.value)} className={textareaStyle}></textarea>
                        </div>
                    </div>
                </AccordionItem>

                 <AccordionItem title="How It Works Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Section Title</label>
                            <input type="text" value={content.howItWorks.title} onChange={e => handleInputChange('howItWorks', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Step 1 Title</label>
                                <input type="text" value={content.howItWorks.step1Title} onChange={e => handleInputChange('howItWorks', 'step1Title', e.target.value)} className={inputStyle} />
                                <label className="block text-sm font-medium text-gray-700 mt-2">Step 1 Text</label>
                                <input type="text" value={content.howItWorks.step1Text} onChange={e => handleInputChange('howItWorks', 'step1Text', e.target.value)} className={inputStyle} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Step 2 Title</label>
                                <input type="text" value={content.howItWorks.step2Title} onChange={e => handleInputChange('howItWorks', 'step2Title', e.target.value)} className={inputStyle} />
                                <label className="block text-sm font-medium text-gray-700 mt-2">Step 2 Text</label>
                                <input type="text" value={content.howItWorks.step2Text} onChange={e => handleInputChange('howItWorks', 'step2Text', e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Step 3 Title</label>
                                <input type="text" value={content.howItWorks.step3Title} onChange={e => handleInputChange('howItWorks', 'step3Title', e.target.value)} className={inputStyle} />
                                <label className="block text-sm font-medium text-gray-700 mt-2">Step 3 Text</label>
                                <input type="text" value={content.howItWorks.step3Text} onChange={e => handleInputChange('howItWorks', 'step3Text', e.target.value)} className={inputStyle} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Step 4 Title</label>
                                <input type="text" value={content.howItWorks.step4Title} onChange={e => handleInputChange('howItWorks', 'step4Title', e.target.value)} className={inputStyle} />
                                <label className="block text-sm font-medium text-gray-700 mt-2">Step 4 Text</label>
                                <input type="text" value={content.howItWorks.step4Text} onChange={e => handleInputChange('howItWorks', 'step4Text', e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                    </div>
                </AccordionItem>
                 <AccordionItem title="Features Section">
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Section Title</label>
                            <input type="text" value={content.features.title} onChange={e => handleInputChange('features', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i}>
                                    <label className="block text-sm font-medium text-gray-700">{`Feature ${i} Title`}</label>
                                    <input type="text" value={content.features[`feature${i}Title` as keyof typeof content.features]} onChange={e => handleInputChange('features', `feature${i}Title` as any, e.target.value)} className={inputStyle} />
                                    <label className="block text-sm font-medium text-gray-700 mt-2">{`Feature ${i} Text`}</label>
                                    <input type="text" value={content.features[`feature${i}Text` as keyof typeof content.features]} onChange={e => handleInputChange('features', `feature${i}Text` as any, e.target.value)} className={inputStyle} />
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionItem>
                
                 <AccordionItem title="For Farmers Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={content.forFarmers.title} onChange={e => handleInputChange('forFarmers', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        {[1, 2, 3, 4].map(i => (
                             <div key={i}>
                                <label className="block text-sm font-medium text-gray-700">{`Benefit Point ${i}`}</label>
                                <input type="text" value={content.forFarmers[`point${i}` as keyof typeof content.forFarmers]} onChange={e => handleInputChange('forFarmers', `point${i}` as any, e.target.value)} className={inputStyle} />
                            </div>
                        ))}
                    </div>
                </AccordionItem>

                <AccordionItem title="For Buyers Section">
                     <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={content.forBuyers.title} onChange={e => handleInputChange('forBuyers', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        {[1, 2, 3, 4].map(i => (
                             <div key={i}>
                                <label className="block text-sm font-medium text-gray-700">{`Benefit Point ${i}`}</label>
                                <input type="text" value={content.forBuyers[`point${i}` as keyof typeof content.forBuyers]} onChange={e => handleInputChange('forBuyers', `point${i}` as any, e.target.value)} className={inputStyle} />
                            </div>
                        ))}
                    </div>
                </AccordionItem>

                 <AccordionItem title="Testimonial Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quote</label>
                            <textarea value={content.testimonial.quote} onChange={e => handleInputChange('testimonial', 'quote', e.target.value)} className={textareaStyle}></textarea>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Author</label>
                                <input type="text" value={content.testimonial.author} onChange={e => handleInputChange('testimonial', 'author', e.target.value)} className={inputStyle} />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Author's Title</label>
                                <input type="text" value={content.testimonial.authorTitle} onChange={e => handleInputChange('testimonial', 'authorTitle', e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                 <AccordionItem title="Statistics Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={content.statistics.title} onChange={e => handleInputChange('statistics', 'title', e.target.value)} className={inputStyle} />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i}>
                                    <label className="block text-sm font-medium text-gray-700">{`Stat ${i} Value`}</label>
                                    <input type="text" value={content.statistics[`stat${i}Value` as keyof typeof content.statistics]} onChange={e => handleInputChange('statistics', `stat${i}Value` as any, e.target.value)} className={inputStyle} />
                                    <label className="block text-sm font-medium text-gray-700 mt-2">{`Stat ${i} Label`}</label>
                                    <input type="text" value={content.statistics[`stat${i}Label` as keyof typeof content.statistics]} onChange={e => handleInputChange('statistics', `stat${i}Label` as any, e.target.value)} className={inputStyle} />
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionItem>

                 <AccordionItem title="USSD Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={content.ussd.title} onChange={e => handleInputChange('ussd', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Text</label>
                            <textarea value={content.ussd.text} onChange={e => handleInputChange('ussd', 'text', e.target.value)} className={textareaStyle}></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Button Text</label>
                            <input type="text" value={content.ussd.cta} onChange={e => handleInputChange('ussd', 'cta', e.target.value)} className={inputStyle} />
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem title="Final Join CTA Section">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={content.joinCta.title} onChange={e => handleInputChange('joinCta', 'title', e.target.value)} className={inputStyle} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Text</label>
                            <textarea value={content.joinCta.text} onChange={e => handleInputChange('joinCta', 'text', e.target.value)} className={textareaStyle}></textarea>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Primary Button Text</label>
                                <input type="text" value={content.joinCta.primaryCta} onChange={e => handleInputChange('joinCta', 'primaryCta', e.target.value)} className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Secondary Button Text</label>
                                <input type="text" value={content.joinCta.secondaryCta} onChange={e => handleInputChange('joinCta', 'secondaryCta', e.target.value)} className={inputStyle} />
                            </div>
                        </div>
                    </div>
                </AccordionItem>
            </div>
        </div>
    );
};

export default AdminCMS;