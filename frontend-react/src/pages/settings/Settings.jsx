import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard,
  Camera,
  Save,
  CheckCircle,
  Globe,
  Moon,
  Sun,
  Trash2,
  LogOut
} from 'lucide-react';
import { useAuth } from '@hooks';

const Settings = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    email: user?.email || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    website: user?.profile?.website || '',
    notifications: {
      email: true,
      push: true,
      marketing: false,
      projectUpdates: true,
      messages: true
    }
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account preferences</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 flex items-center disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
          ) : saveSuccess ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <Save className="w-5 h-5 mr-2" />
          )}
          {isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="glass-morphism p-4 rounded-2xl border border-white/5 sticky top-24">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            <hr className="my-4 border-white/10" />

            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Profile Photo</h3>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-400 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {formData.firstName[0]}{formData.lastName[0]}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center">
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </button>
                      <button className="px-4 py-2 border border-white/10 text-gray-400 rounded-lg hover:text-white hover:bg-white/5 transition-colors">
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">Recommended: 400x400px, JPG or PNG</p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50 resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Location</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="City, Country"
                        className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="www.yourwebsite.com"
                      className="w-full px-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Skills (for editors) */}
              {user?.role === 'editor' && (
                <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                  <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Video Editing', 'Color Grading', 'After Effects', 'Premiere Pro'].map((skill) => (
                      <span 
                        key={skill}
                        className="px-3 py-1.5 bg-primary-500/10 text-primary-400 text-sm rounded-full border border-primary-500/20 flex items-center gap-2"
                      >
                        {skill}
                        <button className="hover:text-white">×</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a skill..."
                      className="flex-1 px-4 py-2 bg-dark-800 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                    <button className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-6">
              {/* Email */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Email Address</h3>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                  <button className="px-4 py-3 bg-dark-700 text-white rounded-xl hover:bg-dark-600 transition-colors">
                    Change Email
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full pl-11 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500/50"
                    />
                  </div>
                  <button className="px-6 py-3 bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              {/* Two-Factor Auth */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
                    <p className="text-gray-400 text-sm mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <button className="px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>

              {/* Delete Account */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Delete Account</h3>
                    <p className="text-gray-400 text-sm mt-1">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-morphism p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
                  { id: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser', icon: Bell },
                  { id: 'marketing', label: 'Marketing Emails', desc: 'Receive updates about new features and promotions', icon: CheckCircle },
                  { id: 'projectUpdates', label: 'Project Updates', desc: 'Get notified about project status changes', icon: CheckCircle },
                  { id: 'messages', label: 'New Messages', desc: 'Get notified when you receive new messages', icon: CheckCircle },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.notifications[item.id]}
                        onChange={(e) => setFormData({
                          ...formData,
                          notifications: { ...formData.notifications, [item.id]: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-dark-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Payment Method */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Payment Method</h3>
                  <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                    Add New
                  </button>
                </div>
                
                <div className="p-4 bg-dark-800 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-400">Expires 12/25</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm rounded-full">
                      Default
                    </span>
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div className="glass-morphism p-6 rounded-2xl border border-white/5">
                <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
                
                <div className="space-y-3">
                  {[
                    { date: 'Mar 15, 2026', amount: '$150.00', status: 'Paid', desc: 'Project payment - Brand Video' },
                    { date: 'Feb 28, 2026', amount: '$250.00', status: 'Paid', desc: 'Project payment - Music Video Edit' },
                    { date: 'Jan 20, 2026', amount: '$500.00', status: 'Paid', desc: 'Project payment - Commercial Series' },
                  ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-dark-800 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{invoice.desc}</p>
                        <p className="text-sm text-gray-400">{invoice.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">{invoice.amount}</p>
                        <p className="text-sm text-green-400">{invoice.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
