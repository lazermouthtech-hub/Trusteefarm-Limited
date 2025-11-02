import React from 'react';
import { Mail, MessageSquare } from 'lucide-react';
import { NewsletterSubscriber, GeneralInquiry } from '../types';
import { classNames } from '../lib/utils';

interface AdminContactsProps {
  subscribers: NewsletterSubscriber[];
  inquiries: GeneralInquiry[];
}

type ActiveTab = 'subscribers' | 'inquiries';

const AdminContacts = ({ subscribers, inquiries }: AdminContactsProps) => {
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('subscribers');

  const sortedSubscribers = React.useMemo(() => {
    return subscribers.slice().sort((a, b) => new Date(b.subscriptionDate).getTime() - new Date(a.subscriptionDate).getTime());
  }, [subscribers]);

  const sortedInquiries = React.useMemo(() => {
    return inquiries.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [inquiries]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 pt-4 border-b border-gray-200">
            <div className="flex space-x-8 -mb-px">
                <button
                    onClick={() => setActiveTab('subscribers')}
                    className={classNames(
                        'pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center',
                        activeTab === 'subscribers'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                >
                    <Mail className="h-5 w-5 mr-2" />
                    Newsletter Subscribers
                </button>
                <button
                    onClick={() => setActiveTab('inquiries')}
                    className={classNames(
                        'pb-3 px-1 border-b-2 font-medium text-sm focus:outline-none flex items-center',
                        activeTab === 'inquiries'
                            ? 'border-primary-500 text-primary-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    General Inquiries
                </button>
            </div>
        </div>

        {activeTab === 'subscribers' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedSubscribers.length > 0 ? (
                  sortedSubscribers.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sub.subscriptionDate).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-6 py-16 text-center text-gray-500">No newsletter subscribers yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Received</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedInquiries.length > 0 ? (
                  sortedInquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{inq.name}</div>
                        <div className="text-sm text-gray-500">{inq.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-normal text-sm text-gray-700 max-w-md">{inq.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(inq.date).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-16 text-center text-gray-500">No general inquiries have been received yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;