import React from 'react';
import { mockFarmers, mockBlogPosts, mockSystemSettings, mockBuyers, mockSubscriptionPlans, mockBuyerRequests } from './data/mockData';
import { Farmer, Page, UserRole, FarmerStatus, BlogPost, BlogPostStatus, SystemSettings, Produce, Buyer, AdminSessionLog, NewsletterSubscriber, OcrUploadHistoryItem, GeneralInquiry, SubscriptionPlan, AdminUser, ProduceStatus, BuyerRequest } from './types';
import { sendTransactionalEmail } from './lib/sendgrid';

// Page Components
import Dashboard from './pages/Dashboard';
import Farmers from './pages/Farmers';
import Marketplace from './pages/Marketplace';
import BulkUpload from './pages/BulkUpload';
import AdminLogin from './pages/AdminLogin';
import AdminMarketplace from './pages/AdminMarketplace';
import AdminContacts from './pages/AdminContacts';
import AdminBlog from './pages/AdminBlog';
import AdminBlogPostEditor from './pages/AdminBlogPostEditor';
import AdminCMS from './pages/AdminCMS';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import ProductDetails from './pages/ProductDetails';
import AdminOCR from './pages/AdminOCR';
import AdminApis from './pages/AdminApis';
import CheckoutPage from './pages/CheckoutPage';
import AdminBuyers from './pages/AdminBuyers';
import AdminBuyerRequests from './pages/AdminBuyerRequests';

import HomePage from './pages/HomePage';
import Blog from './pages/Blog';
import BlogPostPage from './pages/BlogPost';
import FarmerRegistration from './pages/FarmerRegistration';
import FarmerLogin from './pages/FarmerLogin';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProfile from './pages/FarmerProfile';
import FarmerListings from './pages/FarmerListings';
import FarmerSettings from './pages/FarmerSettings';

import BuyerDashboard from './pages/BuyerDashboard';
import BuyerRequests from './pages/BuyerRequests';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import FarmerSidebar from './components/layout/FarmerSidebar';
import FarmerHeader from './components/layout/FarmerHeader';
import BuyerSidebar from './components/layout/BuyerSidebar';
import BuyerHeader from './components/layout/BuyerHeader';
import PublicHeader from './components/layout/PublicHeader';
import AuthModal from './components/auth/AuthModal';
import SimulatedInbox from './components/admin/SimulatedInbox';


const App = () => {
  const [farmers, setFarmers] = React.useState<Farmer[]>(mockFarmers);
  const [buyers, setBuyers] = React.useState<Buyer[]>(mockBuyers);
  const [buyerRequests, setBuyerRequests] = React.useState<BuyerRequest[]>(mockBuyerRequests);
  const [blogPosts, setBlogPosts] = React.useState<BlogPost[]>(mockBlogPosts);
  const [systemSettings, setSystemSettings] = React.useState<SystemSettings>(mockSystemSettings);
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [currentUser, setCurrentUser] = React.useState<AdminUser | Farmer | Buyer | null>(null);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);


  // State for multi-page flows
  const [selectedProduce, setSelectedProduce] = React.useState<{ farmerId: string, produceId: string} | null>(null);
  const [selectedPostId, setSelectedPostId] = React.useState<string | null>(null);
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = React.useState<SubscriptionPlan | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = React.useState<'monthly' | 'yearly'>('monthly');


  // Auth related state
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [registrationSuccess, setRegistrationSuccess] = React.useState(false);

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isFarmerSidebarOpen, setIsFarmerSidebarOpen] = React.useState(false);
  const [isBuyerSidebarOpen, setIsBuyerSidebarOpen] = React.useState(false);


  const handleLogout = () => {
    if (currentUser && 'privilege' in currentUser) { // Check if admin
        setSystemSettings(prevSettings => {
            const activeLogIndex = prevSettings.sessionLogs.slice().reverse().findIndex(log => log.userId === currentUser.id && log.logoutTime === null);
            if (activeLogIndex !== -1) {
                const originalIndex = prevSettings.sessionLogs.length - 1 - activeLogIndex;
                const updatedLogs = [...prevSettings.sessionLogs];
                updatedLogs[originalIndex] = { ...updatedLogs[originalIndex], logoutTime: new Date() };
                return { ...prevSettings, sessionLogs: updatedLogs };
            }
            return prevSettings;
        });
    }
    setCurrentUser(null);
    setCurrentPage('home');
  };
  
  const handleUpdateFarmer = (updatedFarmer: Farmer) => {
    const oldFarmer = farmers.find(f => f.id === updatedFarmer.id);

    if (oldFarmer) {
      // Check for farmer approval email trigger
      if (oldFarmer.status === FarmerStatus.PendingReview && updatedFarmer.status === FarmerStatus.Active && oldFarmer.email) {
        sendTransactionalEmail({
          settings: systemSettings.sendGridSettings,
          recipientEmail: oldFarmer.email,
          recipientName: oldFarmer.name,
          template: 'farmer_approved'
        });
      }

      // Check for produce approval email trigger
      updatedFarmer.produces.forEach(newProduce => {
        const oldProduce = oldFarmer.produces.find(p => p.id === newProduce.id);
        const isApprovedNow = newProduce.status === ProduceStatus.ReadyForSale || newProduce.status === ProduceStatus.UpcomingHarvest;
        if (oldProduce && oldProduce.status === ProduceStatus.PendingApproval && isApprovedNow && oldFarmer.email) {
          sendTransactionalEmail({
            settings: systemSettings.sendGridSettings,
            recipientEmail: oldFarmer.email,
            recipientName: oldFarmer.name,
            template: 'produce_approved'
          });
        }
      });
    }

    setFarmers(prev => prev.map(f => f.id === updatedFarmer.id ? updatedFarmer : f));
  };
  
  const handleAddFarmers = (newFarmers: Farmer[]) => {
    setFarmers(prev => [...prev, ...newFarmers]);
  };

  const handleFarmerRegister = (newFarmerData: Omit<Farmer, 'id' | 'status' | 'profilePhoto' | 'registrationDate' | 'produces' | 'profileCompleteness' | 'buyerRating' | 'successfulTransactions' | 'phoneVerified' | 'identityVerified' | 'bankAccountVerified'>) => {
    const newFarmer: Farmer = {
      id: `farmer_${Date.now()}`,
      status: FarmerStatus.PendingReview,
      profilePhoto: `https://api.dicebear.com/8.x/initials/svg?seed=${newFarmerData.name}`,
      registrationDate: new Date(),
      produces: [],
      profileCompleteness: 0.3,
      buyerRating: 0,
      successfulTransactions: 0,
      phoneVerified: false,
      identityVerified: false,
      bankAccountVerified: false,
      ...newFarmerData,
    };
    setFarmers(prev => [...prev, newFarmer]);
    setRegistrationSuccess(true);
    setCurrentPage('farmer_login');

    if (newFarmer.email) {
        sendTransactionalEmail({
            settings: systemSettings.sendGridSettings,
            recipientEmail: newFarmer.email,
            recipientName: newFarmer.name,
            template: 'farmer_welcome',
        });
    }
  };
  
  const handleFarmerLogin = (phone: string, pass: string): boolean => {
      const farmer = farmers.find(f => f.phone === phone && f.password === pass);
      if (farmer) {
          setCurrentUser(farmer);
          setCurrentPage('farmer_dashboard');
          return true;
      }
      return false;
  };

  const handleAdminLogin = (usernameOrEmail: string, pass: string): boolean => {
    const adminUser = systemSettings.adminUsers.find(
      u => (u.name.toLowerCase() === usernameOrEmail.toLowerCase() || u.email.toLowerCase() === usernameOrEmail.toLowerCase()) && u.status === 'Active'
    );

    if (adminUser && adminUser.password === pass) {
      setCurrentUser(adminUser);
      setCurrentPage('dashboard');

      const newLog: AdminSessionLog = {
          id: `log_${Date.now()}`,
          userId: adminUser.id,
          userName: adminUser.name,
          loginTime: new Date(),
          logoutTime: null,
      };
      setSystemSettings(prev => ({...prev, sessionLogs: [...prev.sessionLogs, newLog]}));

      return true;
    }
    return false;
  };
  
  const handleBuyerLogin = (email: string, pass: string) => {
    const buyer = buyers.find(b => b.email.toLowerCase() === email.toLowerCase());
    if (buyer && pass === "password") { // Mock password check
      setCurrentUser(buyer);
      setCurrentPage('buyer_dashboard');
      setIsAuthModalOpen(false);
      return { success: true };
    }
    return { success: false, message: 'Invalid credentials.' };
  };
  
  const handleBuyerRegister = (name: string, email: string, pass: string) => {
    const newBuyer: Buyer = {
        id: `buyer_${Date.now()}`,
        name,
        email,
        registrationDate: new Date(),
        status: 'Active'
    };
    setBuyers(prev => [newBuyer, ...prev]);
    setCurrentUser(newBuyer);
    setCurrentPage('buyer_dashboard');
    setIsAuthModalOpen(false);
    
    sendTransactionalEmail({
        settings: systemSettings.sendGridSettings,
        recipientEmail: email,
        recipientName: name,
        template: 'buyer_welcome',
    });

    return { success: true };
  };

  const handleAddBuyer = (newBuyerData: Omit<Buyer, 'id'>) => {
    const newBuyer: Buyer = {
      id: `buyer_${Date.now()}`,
      ...newBuyerData,
    };
    setBuyers(prev => [newBuyer, ...prev]);
  };

  const handleUpdateBuyer = (updatedBuyer: Buyer) => {
      setBuyers(prev => prev.map(b => b.id === updatedBuyer.id ? updatedBuyer : b));
  };

  const handleDeleteBuyer = (buyerId: string) => {
      setBuyers(prev => prev.filter(b => b.id !== buyerId));
  };

  const handleAddBuyerRequest = (newRequestData: Omit<BuyerRequest, 'id' | 'buyerId' | 'buyerName' | 'status' | 'dateSubmitted'>) => {
    const buyer = currentUser as Buyer;
    if (!buyer) return;

    const newRequest: BuyerRequest = {
        id: `req_${Date.now()}`,
        buyerId: buyer.id,
        buyerName: buyer.name,
        status: 'Pending',
        dateSubmitted: new Date(),
        ...newRequestData,
    };
    setBuyerRequests(prev => [newRequest, ...prev]);
  };
  
   const handleUpdateBuyerRequest = (requestId: string, newStatus: BuyerRequest['status']) => {
    setBuyerRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: newStatus } : req
    ));
  };
  
  const handleSubscriptionSuccess = (buyerId: string, planName: string, cycle: 'monthly' | 'yearly') => {
    const plan = mockSubscriptionPlans.find(p => p.name === planName);
    if (!plan) return;

    const anYearFromNow = new Date();
    anYearFromNow.setFullYear(anYearFromNow.getFullYear() + 1);
    const aMonthFromNow = new Date();
    aMonthFromNow.setMonth(aMonthFromNow.getMonth() + 1);

    const updatedBuyers = buyers.map(b => 
        b.id === buyerId 
        ? { 
            ...b, 
            subscription: { 
                planName, 
                expiresAt: cycle === 'yearly' ? anYearFromNow : aMonthFromNow,
                contactsAllowed: plan.contacts,
                contactsUsed: 0,
            },
            unlockedFarmerContacts: [], // Reset unlocked contacts on new subscription
          } 
        : b
    );
    setBuyers(updatedBuyers);

    const updatedCurrentUser = updatedBuyers.find(b => b.id === buyerId);
    if (updatedCurrentUser) {
        setCurrentUser(updatedCurrentUser);
        sendTransactionalEmail({
            settings: systemSettings.sendGridSettings,
            recipientEmail: updatedCurrentUser.email,
            recipientName: updatedCurrentUser.name,
            template: 'subscription_success'
        });
    }

    setCurrentPage('product_details');
  };

  const handleViewFarmerContact = (farmerId: string) => {
    const buyer = currentUser as Buyer;
    if (!buyer || !buyer.subscription) return;
    if (buyer.unlockedFarmerContacts?.includes(farmerId)) return; // already unlocked
    if (buyer.subscription.contactsUsed >= buyer.subscription.contactsAllowed) return; // no contacts left

    const updatedBuyer: Buyer = {
      ...buyer,
      unlockedFarmerContacts: [...(buyer.unlockedFarmerContacts || []), farmerId],
      subscription: {
        ...buyer.subscription,
        contactsUsed: (buyer.subscription.contactsUsed || 0) + 1,
      },
    };
    
    setBuyers(prev => prev.map(b => b.id === updatedBuyer.id ? updatedBuyer : b));
    setCurrentUser(updatedBuyer);
  };

  const handleViewProductDetails = (farmerId: string, produceId: string) => {
    setSelectedProduce({ farmerId, produceId });
    setCurrentPage('product_details');
  };

  const handleViewPost = (id: string) => {
    setSelectedPostId(id);
    setCurrentPage('blog_post');
  };

  const handleSavePost = (postToSave: BlogPost) => {
      const isNew = !postToSave.id;
      if (isNew) {
          const newPost = { ...postToSave, id: `post_${Date.now()}`, createdAt: new Date(), updatedAt: new Date() };
          setBlogPosts(prev => [newPost, ...prev]);
      } else {
          setBlogPosts(prev => prev.map(p => p.id === postToSave.id ? { ...postToSave, updatedAt: new Date() } : p));
      }
      setEditingPostId(null);
      setCurrentPage('admin_blog');
  };
  const handleDeletePost = (id: string) => {
      if (window.confirm('Are you sure you want to delete this post?')) {
          setBlogPosts(prev => prev.filter(p => p.id !== id));
      }
  };
   const handleUpdatePostStatus = (id: string, status: BlogPostStatus) => {
        setBlogPosts(prev => prev.map(p => p.id === id ? { ...p, status, updatedAt: new Date() } : p));
    };

    const handleNewsletterSubscribe = (email: string): boolean => {
      const isSubscribed = systemSettings.newsletterSubscribers.some(sub => sub.email.toLowerCase() === email.toLowerCase());
      if (isSubscribed) {
          console.warn("Email already subscribed:", email);
          return false;
      }

      const newSubscriber: NewsletterSubscriber = {
          id: `sub_${Date.now()}`,
          email,
          subscriptionDate: new Date(),
      };

      setSystemSettings(prev => ({
          ...prev,
          newsletterSubscribers: [...prev.newsletterSubscribers, newSubscriber]
      }));

      return true;
    };
    
    const handleContactSubmit = (name: string, email: string, message: string) => {
        const newInquiry: GeneralInquiry = {
            id: `inq_${Date.now()}`,
            name,
            email,
            message,
            date: new Date(),
        };
        setSystemSettings(prev => ({
            ...prev,
            generalInquiries: [newInquiry, ...prev.generalInquiries],
        }));
    };

    const handleOcrUploadSuccess = (logData: Omit<OcrUploadHistoryItem, 'id'>) => {
        const newLogItem: OcrUploadHistoryItem = {
            id: `ocr_log_${Date.now()}`,
            ...logData,
        };
        setSystemSettings(prev => ({
            ...prev,
            ocrUploadHistory: [newLogItem, ...prev.ocrUploadHistory],
        }));
    };

    const handlePlanSelect = (plan: SubscriptionPlan, cycle: 'monthly' | 'yearly') => {
        setSelectedPlan(plan);
        setSelectedBillingCycle(cycle);
        setCurrentPage('checkout');
    };

  const renderAdminPage = () => {
    const adminUser = currentUser as AdminUser;
    if (!adminUser || !('privilege' in adminUser)) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    
    let pageContent;
    switch (currentPage) {
      case 'dashboard':
        pageContent = <Dashboard farmers={farmers} theme={theme} />;
        break;
      case 'farmers':
        pageContent = <Farmers farmers={farmers} onUpdateFarmer={handleUpdateFarmer} />;
        break;
      case 'buyers':
        pageContent = <AdminBuyers buyers={buyers} onAddBuyer={handleAddBuyer} onUpdateBuyer={handleUpdateBuyer} onDeleteBuyer={handleDeleteBuyer} />;
        break;
      case 'admin_buyer_requests':
        pageContent = <AdminBuyerRequests requests={buyerRequests} onUpdateRequestStatus={handleUpdateBuyerRequest} />;
        break;
      case 'admin_marketplace':
        pageContent = <AdminMarketplace farmers={farmers} onUpdateFarmer={handleUpdateFarmer} />;
        break;
      case 'admin_contacts':
        pageContent = <AdminContacts subscribers={systemSettings.newsletterSubscribers} inquiries={systemSettings.generalInquiries} />;
        break;
      case 'bulk_upload':
        pageContent = <BulkUpload onAddFarmers={handleAddFarmers} />;
        break;
      case 'admin_ocr':
        pageContent = <AdminOCR history={systemSettings.ocrUploadHistory} onUploadSuccess={handleOcrUploadSuccess} />;
        break;
      case 'admin_blog':
         if (editingPostId) {
            const post = blogPosts.find(p => p.id === editingPostId);
            pageContent = <AdminBlogPostEditor post={post} onSave={handleSavePost} onCancel={() => { setEditingPostId(null); setCurrentPage('admin_blog'); }} />;
        } else {
            pageContent = <AdminBlog posts={blogPosts} onAddNew={() => { setEditingPostId('new'); }} onEdit={setEditingPostId} onDelete={handleDeletePost} onUpdateStatus={handleUpdatePostStatus}/>;
        }
        break;
      case 'admin_cms':
          pageContent = <AdminCMS settings={systemSettings} onUpdateSettings={setSystemSettings} />;
          break;
      case 'admin_analytics':
          pageContent = <AdminAnalytics farmers={farmers} theme={theme} />;
          break;
      case 'apis':
          pageContent = <AdminApis settings={systemSettings} onUpdateSettings={setSystemSettings} />;
          break;
      case 'admin_settings':
          pageContent = <AdminSettings settings={systemSettings} onUpdateSettings={setSystemSettings} />;
          break;
      default:
        pageContent = <Dashboard farmers={farmers} theme={theme} />;
    }

    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header adminName={adminUser.name} currentPage={currentPage} onMenuClick={() => setIsSidebarOpen(true)} theme={theme} setTheme={setTheme} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
            {pageContent}
          </main>
        </div>
        <SimulatedInbox />
      </div>
    );
  };
  
  const renderFarmerPage = () => {
    const farmer = currentUser as Farmer;
    if (!farmer || !('produces' in farmer)) {
      return <FarmerLogin onLogin={handleFarmerLogin} setCurrentPage={setCurrentPage} registrationSuccess={registrationSuccess} setRegistrationSuccess={setRegistrationSuccess} theme={theme} setTheme={setTheme} />;
    }
    
    let pageContent;
    switch (currentPage) {
        case 'farmer_dashboard':
            pageContent = <FarmerDashboard farmer={farmer}/>;
            break;
        case 'farmer_profile':
            pageContent = <FarmerProfile farmer={farmer} onUpdateProfile={handleUpdateFarmer} />;
            break;
        case 'farmer_listings':
            pageContent = <FarmerListings farmer={farmer} onUpdateFarmer={handleUpdateFarmer} />;
            break;
        case 'marketplace':
            pageContent = <Marketplace farmers={farmers} onViewDetails={handleViewProductDetails} />;
            break;
        case 'product_details':
             if (selectedProduce) {
                const prod = farmers.find(f => f.id === selectedProduce.farmerId)?.produces.find(p => p.id === selectedProduce.produceId);
                const farm = farmers.find(f => f.id === selectedProduce.farmerId);
                if (prod && farm) {
                    pageContent = <ProductDetails produce={prod} farmer={farm} currentUser={currentUser} onBack={() => setCurrentPage('marketplace')} settings={systemSettings} onPlanSelect={handlePlanSelect} onViewFarmerContact={handleViewFarmerContact} />;
                } else {
                     setCurrentPage('marketplace');
                }
             }
             break;
        case 'farmer_settings':
            pageContent = <FarmerSettings />;
            break;
        default:
            pageContent = <FarmerDashboard farmer={farmer}/>;
    }

    return (
       <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans">
        <FarmerSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} isSidebarOpen={isFarmerSidebarOpen} setIsSidebarOpen={setIsFarmerSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <FarmerHeader farmerName={farmer.name} currentPage={currentPage} onMenuClick={() => setIsFarmerSidebarOpen(true)} theme={theme} setTheme={setTheme} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
            {pageContent}
          </main>
        </div>
      </div>
    );
  };
  
  const renderBuyerPage = () => {
      const buyer = currentUser as Buyer;
      if (!buyer || !('email' in buyer)) {
        return renderPublicPage(); // Fallback to public view
      }
      
      let pageContent;
      switch (currentPage) {
          case 'buyer_dashboard':
              pageContent = <BuyerDashboard buyer={buyer} setCurrentPage={setCurrentPage}/>;
              break;
          case 'buyer_requests':
              pageContent = <BuyerRequests 
                requests={buyerRequests}
                currentBuyer={buyer}
                onAddRequest={handleAddBuyerRequest}
              />;
              break;
          case 'marketplace':
              pageContent = <Marketplace farmers={farmers} onViewDetails={handleViewProductDetails} />;
              break;
          case 'product_details':
              if (selectedProduce) {
                  const prod = farmers.find(f => f.id === selectedProduce.farmerId)?.produces.find(p => p.id === selectedProduce.produceId);
                  const farm = farmers.find(f => f.id === selectedProduce.farmerId);
                  if (prod && farm) {
                      pageContent = <ProductDetails produce={prod} farmer={farm} currentUser={currentUser} onBack={() => setCurrentPage('marketplace')} settings={systemSettings} onPlanSelect={handlePlanSelect} onViewFarmerContact={handleViewFarmerContact} />;
                  } else {
                       setCurrentPage('marketplace');
                  }
              }
              break;
          case 'checkout':
                if (selectedPlan) {
                    pageContent = <CheckoutPage
                        plan={selectedPlan}
                        billingCycle={selectedBillingCycle}
                        settings={systemSettings}
                        userEmail={buyer.email}
                        onBack={() => setCurrentPage('product_details')}
                        onSubscriptionSuccess={(planName) => handleSubscriptionSuccess(buyer.id, planName, selectedBillingCycle)}
                    />
                } else {
                    setCurrentPage('marketplace');
                }
                break;
          default:
              pageContent = <BuyerDashboard buyer={buyer} setCurrentPage={setCurrentPage}/>;
      }
  
      return (
         <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans">
          <BuyerSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onLogout={handleLogout} isSidebarOpen={isBuyerSidebarOpen} setIsSidebarOpen={setIsBuyerSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <BuyerHeader buyerName={buyer.name} currentPage={currentPage} onMenuClick={() => setIsBuyerSidebarOpen(true)} theme={theme} setTheme={setTheme} />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-6">
              {pageContent}
            </main>
          </div>
        </div>
      );
  };

  const renderPublicPage = () => {
    let pageContent;
    switch (currentPage) {
        case 'home':
            pageContent = <HomePage content={systemSettings.homePageContent} setCurrentPage={setCurrentPage} onSubscribe={handleNewsletterSubscribe} onContactSubmit={handleContactSubmit} />;
            break;
        case 'marketplace':
            pageContent = (
                <div className="container mx-auto p-4 md:p-6">
                    <Marketplace farmers={farmers} onViewDetails={(farmerId, produceId) => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else {
                        handleViewProductDetails(farmerId, produceId);
                      }
                    }} />
                </div>
            );
            break;
        case 'blog':
            pageContent = <Blog posts={blogPosts} onViewPost={handleViewPost} />;
            break;
        case 'blog_post':
            const post = blogPosts.find(p => p.id === selectedPostId);
            if (post) {
                pageContent = <BlogPostPage post={post} onBack={() => setCurrentPage('blog')} />;
            } else {
                setCurrentPage('blog');
            }
            break;
         case 'product_details':
              if (selectedProduce) {
                  const prod = farmers.find(f => f.id === selectedProduce.farmerId)?.produces.find(p => p.id === selectedProduce.produceId);
                  const farm = farmers.find(f => f.id === selectedProduce.farmerId);
                  if (prod && farm) {
                      pageContent = <ProductDetails produce={prod} farmer={farm} currentUser={currentUser} onBack={() => setCurrentPage('marketplace')} settings={systemSettings} onPlanSelect={handlePlanSelect} onViewFarmerContact={handleViewFarmerContact} />;
                  } else {
                       setCurrentPage('marketplace');
                  }
              }
              break;
        case 'farmer_register':
            return <FarmerRegistration onRegister={handleFarmerRegister} setCurrentPage={setCurrentPage} theme={theme} setTheme={setTheme} />;
        case 'farmer_login':
            return <FarmerLogin onLogin={handleFarmerLogin} setCurrentPage={setCurrentPage} registrationSuccess={registrationSuccess} setRegistrationSuccess={setRegistrationSuccess} theme={theme} setTheme={setTheme} />;
        case 'admin_login':
            pageContent = <AdminLogin onLogin={handleAdminLogin} />;
            break;
        default:
            pageContent = <HomePage content={systemSettings.homePageContent} setCurrentPage={setCurrentPage} onSubscribe={handleNewsletterSubscribe} onContactSubmit={handleContactSubmit} />;
    }
    
    const fullScreenPages: Page[] = ['farmer_register', 'farmer_login'];
    if (fullScreenPages.includes(currentPage)) {
        return pageContent;
    }

    return (
        <div className="font-sans dark:bg-gray-900">
           <PublicHeader currentPage={currentPage} setCurrentPage={setCurrentPage} onBuyerAuthClick={() => setIsAuthModalOpen(true)} theme={theme} setTheme={setTheme} />
           <main>{pageContent}</main>
           <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLogin={handleBuyerLogin} onRegister={handleBuyerRegister} />
        </div>
    );
  };
  
  const userRole = currentUser ? ('privilege' in currentUser ? 'admin' : 'produces' in currentUser ? 'farmer' : 'buyer') : 'public';

  if (userRole === 'admin') return renderAdminPage();
  if (userRole === 'farmer') return renderFarmerPage();
  if (userRole === 'buyer') return renderBuyerPage();
  return renderPublicPage();
};

export default App;