import { Farmer, FarmerStatus, Produce, ProduceCategory, ProduceStatus, BlogPost, BlogPostStatus, SystemSettings, HomePageContent, AdminUser, AdminSessionLog, NewsletterSubscriber, OcrUploadHistoryItem } from '../types';

export const mockProduces: Produce[] = [
  {
    id: 'prod_1',
    name: 'Maize',
    variety: 'Obatampa',
    category: ProduceCategory.Grains,
    status: ProduceStatus.ReadyForSale,
    quantity: 500,
    unit: 'bags',
    availableFrom: new Date('2023-10-01'),
    photos: ['https://images.unsplash.com/photo-1598937982237-ed8441499573?q=80&w=2070&auto=format&fit=crop'],
    isOrganic: false,
    dateAdded: new Date('2023-09-20'),
  },
  {
    id: 'prod_2',
    name: 'Tomato',
    variety: 'Pectomech',
    category: ProduceCategory.Vegetables,
    status: ProduceStatus.UpcomingHarvest,
    quantity: 100,
    unit: 'crates',
    availableFrom: new Date('2023-11-15'),
    expectedHarvestDate: new Date('2023-11-10'),
    photos: ['https://images.unsplash.com/photo-1588694853939-a4f63c5e82c8?q=80&w=2070&auto=format&fit=crop'],
    isOrganic: true,
    dateAdded: new Date('2023-10-05'),
  },
   {
    id: 'prod_3',
    name: 'Cassava',
    variety: 'Bankye',
    category: ProduceCategory.Tubers,
    status: ProduceStatus.ReadyForSale,
    quantity: 2,
    unit: 'ton',
    availableFrom: new Date('2023-09-01'),
    photos: ['https://images.unsplash.com/photo-1620888012499-53e6b3b5553e?q=80&w=1964&auto=format&fit=crop'],
    isOrganic: false,
    dateAdded: new Date('2023-08-25'),
  },
];

export const mockFarmers: Farmer[] = [
  {
    id: 'farmer_1',
    name: 'Kwame Mensah',
    location: 'Ashanti',
    phone: '+233244123456',
    password: 'password',
    status: FarmerStatus.Active,
    profilePhoto: 'https://api.dicebear.com/8.x/initials/svg?seed=Kwame Mensah',
    registrationDate: new Date('2023-01-15'),
    produces: [mockProduces[0], mockProduces[1]],
    profileCompleteness: 0.9,
    buyerRating: 4.5,
    successfulTransactions: 25,
    phoneVerified: true,
    identityVerified: true,
    bankAccountVerified: true,
    farmSize: 15,
    farmingMethods: 'Conventional'
  },
  {
    id: 'farmer_2',
    name: 'Aba Yeboah',
    location: 'Central',
    phone: '+233200987654',
    password: 'password',
    status: FarmerStatus.Active,
    profilePhoto: 'https://api.dicebear.com/8.x/initials/svg?seed=Aba Yeboah',
    registrationDate: new Date('2023-05-20'),
    produces: [mockProduces[2]],
    profileCompleteness: 0.7,
    buyerRating: 4.8,
    successfulTransactions: 12,
    phoneVerified: true,
    identityVerified: false,
    bankAccountVerified: true,
    farmSize: 8,
    farmingMethods: 'Organic'
  },
  {
    id: 'farmer_3',
    name: 'Femi Adebayo',
    location: 'Volta',
    phone: '+233555111222',
    password: 'password',
    status: FarmerStatus.PendingReview,
    profilePhoto: 'https://api.dicebear.com/8.x/initials/svg?seed=Femi Adebayo',
    registrationDate: new Date('2023-10-10'),
    produces: [{
        id: 'prod_4',
        name: 'Yam',
        variety: 'Puna',
        category: ProduceCategory.Tubers,
        status: ProduceStatus.PendingApproval,
        quantity: 200,
        unit: 'kg',
        availableFrom: new Date(),
        dateAdded: new Date(),
        photos: [],
        isOrganic: false,
    }],
    profileCompleteness: 0.4,
    buyerRating: 0,
    successfulTransactions: 0,
    phoneVerified: false,
    identityVerified: false,
    bankAccountVerified: false,
  },
  {
    id: 'farmer_4',
    name: 'Esi Parker',
    location: 'Western',
    phone: '+233277333444',
    password: 'password',
    status: FarmerStatus.Rejected,
    profilePhoto: 'https://api.dicebear.com/8.x/initials/svg?seed=Esi Parker',
    registrationDate: new Date('2023-08-01'),
    produces: [],
    profileCompleteness: 0.8,
    buyerRating: 3.0,
    successfulTransactions: 2,
    phoneVerified: true,
    identityVerified: true,
    bankAccountVerified: false,
  },
];

export const mockBlogPosts: BlogPost[] = [
    {
        id: 'post_1',
        title: 'The Future of Maize Farming in Ghana',
        content: 'Ghana\'s agricultural sector is on the brink of a technological revolution, and maize farming is at its forefront. This article explores the innovative techniques and sustainable practices that are set to redefine maize cultivation, ensuring food security and economic growth for the nation. From precision agriculture to improved seed varieties, we delve into the future of one of Ghana\'s most vital crops.\n\nWe also examine the role of government policies and private sector partnerships in creating a supportive ecosystem for farmers. With the right strategies, Ghana can not only meet its domestic demand but also become a major maize exporter in the West African sub-region.',
        author: 'Admin Team',
        category: 'Innovation',
        imageUrl: 'https://images.unsplash.com/photo-1599557422934-25a7a7238860?q=80&w=2070&auto=format&fit=crop',
        status: BlogPostStatus.Published,
        createdAt: new Date('2023-10-01'),
        updatedAt: new Date('2023-10-01'),
    },
    {
        id: 'post_2',
        title: 'A Guide to Organic Tomato Cultivation',
        content: 'Embracing organic farming is not just a trend; it\'s a commitment to healthier food and a sustainable environment. This comprehensive guide provides farmers with practical steps for organic tomato cultivation. Learn about natural pest control, soil enrichment techniques, and the benefits of choosing organic. We cover everything from selecting the right tomato varieties for Ghana\'s climate to harvesting and marketing your premium organic produce.\n\nJoin the movement towards a greener agricultural landscape and discover how organic farming can increase the value of your yield and open up new market opportunities.',
        author: 'Jane Doe, Agronomist',
        category: 'Farming Tips',
        imageUrl: 'https://images.unsplash.com/photo-1561155635-43a186da0042?q=80&w=2070&auto=format&fit=crop',
        status: BlogPostStatus.Published,
        createdAt: new Date('2023-09-15'),
        updatedAt: new Date('2023-09-18'),
    },
     {
        id: 'post_3',
        title: 'Understanding Market Trends for Q4 2023',
        content: 'As we head into the final quarter of the year, it is crucial for farmers to understand the shifting market dynamics. This post will analyze price trends and demand forecasts for key crops.',
        author: 'Admin Team',
        category: 'Market Analysis',
        imageUrl: 'https://images.unsplash.com/photo-1611095790444-9091e35a01a3?q=80&w=2070&auto=format&fit=crop',
        status: BlogPostStatus.Draft,
        createdAt: new Date('2023-10-05'),
        updatedAt: new Date('2023-10-05'),
    },
];

const mockHomePageContent: HomePageContent = {
    hero: {
        title: 'Connecting Farmers, Empowering Ghana',
        subtitle: 'The trusted digital marketplace for Ghanaian agriculture. Find quality produce, connect with verified farmers, and grow your business.',
        primaryCta: 'Explore Marketplace',
        secondaryCta: 'Register as a Farmer'
    },
    mission: {
        title: 'Our Mission',
        text: 'To build a transparent and efficient agricultural ecosystem in Ghana by empowering smallholder farmers with technology, market access, and data-driven insights.'
    },
    howItWorks: {
        title: 'How It Works',
        step1Title: 'Farmer Onboarding',
        step1Text: 'Farmers register and are guided to create detailed profiles, listing their crops and farm data.',
        step2Title: 'AI-Powered Grading',
        step2Text: 'Our system analyzes farmer data to generate a trust score, ensuring quality and reliability.',
        step3Title: 'Marketplace Listing',
        step3Text: 'Verified produce is listed on our digital marketplace, accessible to a wide network of buyers.',
        step4Title: 'Direct Connection',
        step4Text: 'Buyers connect directly with farmers to negotiate prices and arrange logistics, fostering fair trade.'
    },
    features: {
        title: 'Key Features',
        feature1Title: 'Advanced Farmer Profiles',
        feature1Text: 'In-depth profiles with verification status, crop details, and performance history.',
        feature2Title: 'Dynamic Marketplace',
        feature2Text: 'A real-time platform to discover, compare, and source agricultural products.',
        feature3Title: 'AI Trust Score',
        feature3Text: 'An intelligent grading system that promotes transparency and rewards quality farmers.',
        feature4Title: 'Verified & Trusted',
        feature4Text: 'A secure platform where all stakeholders can transact with confidence and peace of mind.'
    },
    forFarmers: {
        title: 'For Our Farmers',
        point1: 'Access a wider market of buyers beyond your local region.',
        point2: 'Build a digital reputation and increase your credibility.',
        point3: 'Get fair prices for your produce through direct negotiation.',
        point4: 'Receive insights and support to improve your farming practices.'
    },
    forBuyers: {
        title: 'For Our Buyers',
        point1: 'Source from a network of verified and graded farmers.',
        point2: 'Ensure consistent quality and reliable supply for your business.',
        point3: 'Discover new products and farmers from all over Ghana.',
        point4: 'Streamline your procurement process with our easy-to-use platform.'
    },
    testimonial: {
        quote: '"Trusteefarm has transformed my business. I can now sell my maize to buyers in Accra directly, without any middlemen. My profits have increased by 40%!"',
        author: 'Kwame Mensah',
        authorTitle: 'Maize Farmer, Ashanti Region'
    },
    statistics: {
        title: 'Our Impact in Numbers',
        stat1Value: '5,000+',
        stat1Label: 'Registered Farmers',
        stat2Value: '10,000+',
        stat2Label: 'Tonnes Traded',
        stat3Value: '16',
        stat3Label: 'Regions Covered',
        stat4Value: '25%',
        stat4Label: 'Avg. Income Increase'
    },
    ussd: {
        title: 'Dial *920*15# to Join 3000+ Farmers Across Ghana',
        text: 'Farmers, TrusteeFarm has made it easier for you to connect with us and let us know what you are planting. This allows us to reach out when there is a need and provide support.',
        cta: 'Get Started'
    },
    joinCta: {
        title: 'Join the Agricultural Revolution',
        text: 'Whether you are a farmer looking to grow or a buyer seeking quality, Trusteefarm is your partner in success.',
        primaryCta: 'I am a Farmer',
        secondaryCta: 'I am a Buyer'
    }
};

const mockAdminUsers: AdminUser[] = [
    { id: 'admin_1', name: 'judebeyou', email: 'judebeyou@trusteefarm.com', privilege: 'Super Admin', status: 'Active', lastLogin: new Date('2023-10-25'), password: 'KingPere2022$' },
    { id: 'admin_2', name: 'Content Moderator', email: 'moderator@trusteefarm.com', privilege: 'Moderator', status: 'Active', lastLogin: new Date('2023-10-28'), password: 'ModeratorPass123!' },
    { id: 'admin_3', name: 'cyndybeyou', email: 'cyndybeyou@trusteefarm.com', privilege: 'Super Admin', status: 'Active', lastLogin: new Date(), password: 'KingPere2022$' },
];

// Refactored date creation for clarity and type safety.
const now = new Date();
const log1LoginTime = new Date(now);
log1LoginTime.setDate(now.getDate() - 2);
const log1LogoutTime = new Date(log1LoginTime);
log1LogoutTime.setHours(log1LoginTime.getHours() + 4);

const log2LoginTime = new Date(now);
log2LoginTime.setDate(now.getDate() - 1);
const log2LogoutTime = new Date(log2LoginTime);
log2LogoutTime.setHours(log2LoginTime.getHours() + 2);

const log3LoginTime = new Date(now);
log3LoginTime.setHours(now.getHours() - 1);

const mockAdminSessionLogs: AdminSessionLog[] = [
    { id: 'log_1', userId: 'admin_1', userName: 'judebeyou', loginTime: log1LoginTime, logoutTime: log1LogoutTime },
    { id: 'log_2', userId: 'admin_2', userName: 'Content Moderator', loginTime: log2LoginTime, logoutTime: log2LogoutTime },
    { id: 'log_3', userId: 'admin_1', userName: 'judebeyou', loginTime: log3LoginTime, logoutTime: null },
];

const mockNewsletterSubscribers: NewsletterSubscriber[] = [
    { id: 'sub_1', email: 'interested.buyer@example.com', subscriptionDate: new Date('2023-10-20') },
    { id: 'sub_2', email: 'agri.investor@example.com', subscriptionDate: new Date('2023-10-22') },
    { id: 'sub_3', email: 'food.blogger@example.com', subscriptionDate: new Date('2023-10-25') },
];

const mockOcrUploadHistory: OcrUploadHistoryItem[] = [
    { id: 'ocr_1', fileName: 'farmer_list.jpg', date: new Date(new Date().setDate(new Date().getDate() - 1)), status: 'Success', recordsExtracted: 15 },
    { id: 'ocr_2', fileName: 'ghana_card.png', date: new Date(new Date().setDate(new Date().getDate() - 2)), status: 'Success', recordsExtracted: 1 },
    { id: 'ocr_3', fileName: 'blurry_doc.pdf', date: new Date(new Date().setDate(new Date().getDate() - 3)), status: 'Failed', recordsExtracted: 0 },
];

export const mockSystemSettings: SystemSettings = {
    adminUsers: mockAdminUsers,
    homePageContent: mockHomePageContent,
    sessionLogs: mockAdminSessionLogs,
    newsletterSubscribers: mockNewsletterSubscribers,
    generalInquiries: [],
    ocrUploadHistory: mockOcrUploadHistory,
    paymentSettings: {
        activeGateway: 'paystack',
        paystack: {
            mode: 'test',
            testPublicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with a real test key for testing
            testSecretKey: 'sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            livePublicKey: '',
            liveSecretKey: '',
        }
    },
    sendGridSettings: {
        apiKey: 'SG.mock_api_key_for_demonstration.abcdef123456',
        enabled: true,
        farmerWelcomeTemplateId: 'd-farmerwelcometemplate12345',
        buyerWelcomeTemplateId: '',
        subscriptionSuccessTemplateId: '',
        farmerApprovedTemplateId: '',
        produceApprovedTemplateId: '',
    }
};