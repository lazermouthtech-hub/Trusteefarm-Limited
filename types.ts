import { ReactNode } from "react";

export type UserRole = 'admin' | 'farmer' | 'buyer' | 'public';

export type Page = 
  // Admin pages
  | 'dashboard' | 'farmers' | 'buyers' | 'admin_marketplace' | 'admin_contacts' | 'bulk_upload' 
  | 'admin_blog' | 'admin_cms' | 'admin_analytics' | 'admin_settings' | 'admin_login' | 'admin_ocr' | 'apis'
  | 'admin_buyer_requests'
  // Farmer pages
  | 'farmer_dashboard' | 'farmer_profile' | 'farmer_listings' | 'farmer_settings'
  | 'farmer_register' | 'farmer_login'
  // Buyer pages
  | 'buyer_dashboard' | 'buyer_requests'
  // Public pages
  | 'home' | 'marketplace' | 'blog' | 'blog_post' | 'product_details' | 'checkout';

export enum FarmerStatus {
  Active = 'Active',
  PendingReview = 'Pending Review',
  Rejected = 'Rejected',
}

export enum ProduceStatus {
    PendingApproval = 'Pending Approval',
    ReadyForSale = 'Ready for Sale',
    UpcomingHarvest = 'Upcoming Harvest',
    Sold = 'Sold',
    Rejected = 'Rejected',
}

export enum ProduceCategory {
  Fruits = 'Fruits',
  Vegetables = 'Vegetables',
  Grains = 'Grains',
  Tubers = 'Tubers',
}

export enum GradingBadge {
    Premium = 'Premium',
    Trusted = 'Trusted',
    Verified = 'Verified',
    NewFarmer = 'New Farmer',
}

export interface GradingInfo {
    score: number;
    stars: number;
    badge: GradingBadge;
}

export interface Produce {
    id: string;
    name: string;
    variety: string;
    category: ProduceCategory;
    status: ProduceStatus;
    quantity: number;
    unit: 'kg' | 'ton' | 'bags' | 'crates' | 'pieces';
    availableFrom: Date;
    expectedHarvestDate?: Date;
    photos: string[];
    isOrganic: boolean;
    dateAdded: Date;
}

export interface Farmer {
  id: string;
  name: string;
  location: string; // Region
  phone: string;
  password?: string;
  status: FarmerStatus;
  profilePhoto: string;
  registrationDate: Date;
  produces: Produce[];
  // Data for Grading
  profileCompleteness: number; // 0 to 1
  buyerRating: number; // 0 to 5
  successfulTransactions: number;
  phoneVerified: boolean;
  identityVerified: boolean;
  bankAccountVerified: boolean;
  // Optional detailed info
  email?: string;
  farmName?: string;
  farmSize?: number; // in acres
  gender?: 'Male' | 'Female' | 'Other';
  dateOfBirth?: Date;
  preferredLanguage?: string;
  farmingMethods?: 'Organic' | 'Conventional' | 'Mixed';
  mobileMoneyNumber?: string;
  nationalId?: string;
}

export interface Buyer {
    id: string;
    name: string;
    email: string;
    registrationDate: Date;
    status: 'Active' | 'Inactive';
    subscription?: {
        planName: string;
        expiresAt: Date;
        contactsAllowed: number;
        contactsUsed: number;
    };
    unlockedFarmerContacts?: string[];
}

export interface BuyerRequest {
    id: string;
    buyerId: string;
    buyerName: string;
    produceName: string;
    quantity: number;
    unit: 'kg' | 'ton' | 'bags' | 'crates' | 'pieces';
    requestType: 'Local' | 'Export';
    destinationCountry?: string;
    requiredByDate: Date;
    status: 'Pending' | 'In Progress' | 'Fulfilled' | 'Cancelled';
    dateSubmitted: Date;
    processing: 'Raw' | 'Dried' | 'Any';
    grade: 'Grade A' | 'Grade B' | 'Grade C' | 'Any';
    specifications?: string;
}

export enum BlogPostStatus {
    Published = 'Published',
    Draft = 'Draft',
}

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    author: string;
    category: string;
    imageUrl: string;
    status: BlogPostStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface HomePageContent {
    hero: {
        title: string;
        subtitle: string;
        primaryCta: string;
        secondaryCta: string;
    };
    mission: {
        title: string;
        text: string;
    };
    howItWorks: {
        title: string;
        step1Title: string;
        step1Text: string;
        step2Title: string;
        step2Text: string;
        step3Title: string;
        step3Text: string;
        step4Title: string;
        step4Text: string;
    };
    features: {
        title: string;
        feature1Title: string;
        feature1Text: string;
        feature2Title: string;
        feature2Text: string;
        feature3Title: string;
        feature3Text: string;
        feature4Title: string;
        feature4Text: string;
    };
     forFarmers: {
        title: string;
        point1: string;
        point2: string;
        point3: string;
        point4: string;
    };
    forBuyers: {
        title: string;
        point1: string;
        point2: string;
        point3: string;
        point4: string;
    };
    testimonial: {
        quote: string;
        author: string;
        authorTitle: string;
    };
    statistics: {
        title: string;
        stat1Value: string;
        stat1Label: string;
        stat2Value: string;
        stat2Label: string;
        stat3Value: string;
        stat3Label: string;
        stat4Value: string;
        stat4Label: string;
    };
    ussd: {
        title: string;
        text: string;
        cta: string;
    };
    joinCta: {
        title: string;
        text: string;
        primaryCta: string;
        secondaryCta: string;
    };
}

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    privilege: 'Super Admin' | 'Moderator' | 'Content Editor';
    status: 'Active' | 'Inactive';
    lastLogin: Date;
    password?: string;
}

export interface AdminSessionLog {
    id: string;
    userId: string;
    userName: string;
    loginTime: Date;
    logoutTime: Date | null;
}

export interface NewsletterSubscriber {
    id: string;
    email: string;
    subscriptionDate: Date;
}

export interface GeneralInquiry {
    id: string;
    name: string;
    email: string;
    message: string;
    date: Date;
}

export interface SubscriptionPlan {
  name: string;
  price: { monthly: number; yearly: number };
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
  contacts: number;
}

export interface OcrUploadHistoryItem {
    id: string;
    fileName: string;
    date: Date;
    status: 'Success' | 'Failed';
    recordsExtracted: number;
}

export interface PaystackSettings {
    testSecretKey: string;
    liveSecretKey: string;
    testPublicKey: string;
    livePublicKey: string;
    mode: 'test' | 'live';
}

export interface PaymentSettings {
    activeGateway: 'paystack' | 'none';
    paystack: PaystackSettings;
}

export interface SendGridSettings {
    apiKey: string;
    enabled: boolean;
    farmerWelcomeTemplateId: string;
    buyerWelcomeTemplateId: string;
    subscriptionSuccessTemplateId: string;
    farmerApprovedTemplateId: string;
    produceApprovedTemplateId: string;
}

// FIX: Added missing MailchimpSettings interface to resolve compilation error in lib/mailchimp.ts.
export interface MailchimpSettings {
    apiKey: string;
    serverPrefix: string;
    enabled: boolean;
    farmerWelcomeTemplateId: string;
    buyerWelcomeTemplateId: string;
    subscriptionSuccessTemplateId: string;
    farmerApprovedTemplateId: string;
    produceApprovedTemplateId: string;
}

export interface SystemSettings {
    adminUsers: AdminUser[];
    homePageContent: HomePageContent;
    sessionLogs: AdminSessionLog[];
    newsletterSubscribers: NewsletterSubscriber[];
    generalInquiries: GeneralInquiry[];
    ocrUploadHistory: OcrUploadHistoryItem[];
    paymentSettings: PaymentSettings;
    sendGridSettings: SendGridSettings;
}