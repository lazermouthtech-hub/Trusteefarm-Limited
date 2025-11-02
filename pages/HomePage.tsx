import React from 'react';
import { Target, UserPlus, DatabaseZap, Store, Handshake, UserCog, ShoppingCart, Wand2, BadgeCheck, Quote, BarChart, Twitter, Facebook, Instagram, Youtube, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Page, HomePageContent } from '../types';
import LogoIcon from '../components/layout/LogoIcon';
import ContactModal from '../components/home/ContactModal';

interface HomePageProps {
  content: HomePageContent;
  setCurrentPage: (page: Page) => void;
  onSubscribe: (email: string) => boolean;
  onContactSubmit: (name: string, email: string, message: string) => void;
}

const HomePage = ({ content, setCurrentPage, onSubscribe, onContactSubmit }: HomePageProps) => {

  const [subscribeEmail, setSubscribeEmail] = React.useState('');
  const [subscribeMessage, setSubscribeMessage] = React.useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeMessage(null);
    if (!subscribeEmail) {
      setSubscribeMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    const success = onSubscribe(subscribeEmail);
    if (success) {
      setSubscribeMessage({ type: 'success', text: 'Thank you for subscribing!' });
      setSubscribeEmail('');
    } else {
      setSubscribeMessage({ type: 'error', text: 'This email is already subscribed.' });
    }
  };

  const handleModalContactSubmit = (name: string, email: string, message: string) => {
    onContactSubmit(name, email, message);
    // Do not close the modal here. The modal will show a success message
    // and provide its own close button.
  };

  const StatCounter = ({ value, label }: { value: string, label: string }) => (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-bold text-primary-600">{value}</p>
      <p className="mt-2 text-sm md:text-base text-gray-600">{label}</p>
    </div>
  );

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <section className="relative bg-primary-900 text-white" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
         <div className="absolute inset-0 bg-primary-950 opacity-70"></div>
        <div className="relative container mx-auto px-6 py-40 md:py-48 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{content.hero.title}</h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-primary-200">{content.hero.subtitle}</p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => setCurrentPage('marketplace')} className="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105">{content.hero.primaryCta}</button>
            <button onClick={() => setCurrentPage('farmer_register')} className="bg-transparent hover:bg-white/20 border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg transition">{content.hero.secondaryCta}</button>
          </div>
        </div>
      </section>

      {/* 2. Our Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <Target className="h-16 w-16 mx-auto text-primary-600" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">{content.mission.title}</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">{content.mission.text}</p>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">{content.howItWorks.title}</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 rounded-full p-6"><UserPlus className="h-10 w-10 text-primary-700" /></div>
              <h3 className="mt-4 text-xl font-semibold">{content.howItWorks.step1Title}</h3>
              <p className="mt-2 text-gray-600">{content.howItWorks.step1Text}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 rounded-full p-6"><DatabaseZap className="h-10 w-10 text-primary-700" /></div>
              <h3 className="mt-4 text-xl font-semibold">{content.howItWorks.step2Title}</h3>
              <p className="mt-2 text-gray-600">{content.howItWorks.step2Text}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 rounded-full p-6"><Store className="h-10 w-10 text-primary-700" /></div>
              <h3 className="mt-4 text-xl font-semibold">{content.howItWorks.step3Title}</h3>
              <p className="mt-2 text-gray-600">{content.howItWorks.step3Text}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary-100 rounded-full p-6"><Handshake className="h-10 w-10 text-primary-700" /></div>
              <h3 className="mt-4 text-xl font-semibold">{content.howItWorks.step4Title}</h3>
              <p className="mt-2 text-gray-600">{content.howItWorks.step4Text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Key Features Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">{content.features.title}</h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <UserCog className="h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-xl font-semibold">{content.features.feature1Title}</h3>
              <p className="mt-2 text-gray-600">{content.features.feature1Text}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <ShoppingCart className="h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-xl font-semibold">{content.features.feature2Title}</h3>
              <p className="mt-2 text-gray-600">{content.features.feature2Text}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Wand2 className="h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-xl font-semibold">{content.features.feature3Title}</h3>
              <p className="mt-2 text-gray-600">{content.features.feature3Text}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BadgeCheck className="h-10 w-10 text-primary-600" />
              <h3 className="mt-4 text-xl font-semibold">{content.features.feature4Title}</h3>
              <p className="mt-2 text-gray-600">{content.features.feature4Text}</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 5. For Farmers Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop" alt="Happy Farmer" className="rounded-lg shadow-xl" />
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{content.forFarmers.title}</h2>
            <ul className="mt-6 space-y-4 text-lg text-gray-600">
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forFarmers.point1}</li>
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forFarmers.point2}</li>
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forFarmers.point3}</li>
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forFarmers.point4}</li>
            </ul>
          </div>
        </div>
      </section>
      
      {/* 6. For Buyers Section */}
       <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
           <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900">{content.forBuyers.title}</h2>
            <ul className="mt-6 space-y-4 text-lg text-gray-600">
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forBuyers.point1}</li>
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forBuyers.point2}</li>
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forBuyers.point3}</li>
              <li className="flex items-start"><BadgeCheck className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-1" />{content.forBuyers.point4}</li>
            </ul>
          </div>
          <div className="order-1 md:order-2 overflow-hidden rounded-lg shadow-xl">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop" alt="Marketplace" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          </div>
        </div>
      </section>

      {/* 7. Testimonial Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="container mx-auto px-6 text-center">
            <Quote className="h-16 w-16 mx-auto text-primary-400" />
            <p className="mt-6 max-w-3xl mx-auto text-2xl font-medium">{content.testimonial.quote}</p>
            <p className="mt-6 font-bold text-lg">{content.testimonial.author}</p>
            <p className="text-primary-200">{content.testimonial.authorTitle}</p>
        </div>
      </section>
      
      {/* 8. Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">{content.statistics.title}</h2>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCounter value={content.statistics.stat1Value} label={content.statistics.stat1Label} />
                <StatCounter value={content.statistics.stat2Value} label={content.statistics.stat2Label} />
                <StatCounter value={content.statistics.stat3Value} label={content.statistics.stat3Label} />
                <StatCounter value={content.statistics.stat4Value} label={content.statistics.stat4Label} />
            </div>
        </div>
      </section>

      {/* 9. USSD Call to Action Section */}
      <section 
        className="relative text-white" 
        style={{ 
          backgroundImage: 'url(https://storage.googleapis.com/aistudio-hub-files/collaboration-5264/4513192c-631c-42d4-a740-108a705a676b.jpeg)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center' 
        }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative container mx-auto px-6 py-32 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold">{content.ussd.title}</h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">{content.ussd.text}</p>
          <button onClick={() => setCurrentPage('farmer_register')} className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
            {content.ussd.cta}
          </button>
        </div>
      </section>

      {/* 10. Join Our Network CTA Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-gray-900">{content.joinCta.title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">{content.joinCta.text}</p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                 <button onClick={() => setCurrentPage('farmer_register')} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full text-lg transition">{content.joinCta.primaryCta}</button>
                 <button onClick={() => setCurrentPage('marketplace')} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-full text-lg transition">{content.joinCta.secondaryCta}</button>
            </div>
        </div>
      </section>

      {/* 11. Newsletter Subscription Section */}
      <section className="bg-primary-600">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white">Subscribe to Our Newsletter</h2>
            <p className="mt-4 text-lg text-primary-100">Get the latest updates on market trends, new farmers, and platform features directly in your inbox.</p>
            <form onSubmit={handleSubscribeSubmit} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                className="flex-grow px-4 py-3 rounded-md bg-black bg-opacity-25 border-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-600 focus:ring-yellow-400"
                required
              />
              <button type="submit" className="bg-yellow-400 text-gray-900 font-bold py-3 px-6 rounded-md hover:bg-yellow-300 transition-colors">
                Subscribe
              </button>
            </form>
            {subscribeMessage && (
              <div className={`mt-4 text-sm flex items-center justify-center ${subscribeMessage.type === 'success' ? 'text-green-200' : 'text-red-300'}`}>
                {subscribeMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertTriangle className="h-5 w-5 mr-2" />}
                {subscribeMessage.text}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* New Simple Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Growing Together for a Stronger Ghana</h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-600">
            Our platform is more than a marketplace; it's a community dedicated to sustainable farming, fair trade, and the shared success of every stakeholder in Ghana's agricultural future.
          </p>
          <div className="mt-8">
            <button 
              onClick={() => setCurrentPage('marketplace')} 
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
            >
              Explore Our Community
            </button>
          </div>
        </div>
      </section>
      
      {/* 12. Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2">
                    <LogoIcon className="h-8 w-8" />
                    <span className="text-2xl font-bold">Trusteefarm</span>
                  </div>
                  <p className="mt-4 text-gray-400">Connecting Ghana's agricultural stakeholders for a prosperous future.</p>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold">Navigation</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }} className="text-gray-400 hover:text-white">Home</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('marketplace'); }} className="text-gray-400 hover:text-white">Marketplace</a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('blog'); }} className="text-gray-400 hover:text-white">Blog</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Legal</h3>
                    <ul className="mt-4 space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
                        <li><button onClick={() => setIsContactModalOpen(true)} className="text-gray-400 hover:text-white">Contact Us</button></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold">Connect</h3>
                    <div className="flex mt-4 space-x-4">
                        <a href="https://www.facebook.com/Trusteefarm" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Facebook /></a>
                        <a href="https://www.instagram.com/trusteefarm_official/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Instagram /></a>
                        <a href="https://x.com/Trusteefarm1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Twitter /></a>
                        <a href="http://www.youtube.com/@TrusteefarmLimited" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Youtube /></a>
                    </div>
                </div>
            </div>
             <div className="mt-12 border-t border-gray-800 pt-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} Trusteefarm. All rights reserved.</p>
            </div>
        </div>
      </footer>

      <ContactModal 
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleModalContactSubmit}
      />
    </div>
  );
};

export default HomePage;