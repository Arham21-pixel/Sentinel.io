import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import dayjs from 'dayjs';
import { useMemo, useState, useEffect } from 'react';
import { Shield, Clock, Globe, Users, CheckCircle, XCircle, AlertTriangle, Zap, BarChart3, Settings, Activity, FileText, Bell, Search, Menu, X, Home, Database, Lock, Brain, TrendingUp, UserCheck, Plus, Edit, Trash2, Eye, EyeOff, Calendar, Filter, Download, RefreshCw, Star, Heart, Smile } from 'lucide-react';
import { LampAnimation } from '../components/LampAnimation';
import { InfiniteMovingCards } from '../components/InfiniteMovingCards';
import { HoverEffect } from '../components/CardHoverEffect';
import { UserModal } from '../components/UserModal';
import { RuleModal } from '../components/RuleModal';
import { StickyScroll } from '../components/StickyScrollReveal';

type User = { id: string; name: string; role: 'child' | 'parent' | 'admin' };
type Rule = { id: string; name: string; expression: string; effect: 'allow' | 'block'; priority: number; enabled: boolean };

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:4000/api';

export default function App() {
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await axios.get<User[]>(`${API_BASE}/users`)).data,
  });
  const rulesQuery = useQuery({
    queryKey: ['rules'],
    queryFn: async () => (await axios.get<Rule[]>(`${API_BASE}/rules`)).data,
  });

  const [selectedUser, setSelectedUser] = useState<string>('');
  const [testUrl, setTestUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [iso, setIso] = useState<string>(dayjs().toISOString());
  const [showLampAnimation, setShowLampAnimation] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // User management
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState<boolean>(false);
  const [localUsers, setLocalUsers] = useState<User[]>(() => {
    // Load users from localStorage on initialization
    const savedUsers = localStorage.getItem('sentinel-local-users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });
  
  // Parental rules management
  const [isRuleModalOpen, setIsRuleModalOpen] = useState<boolean>(false);
  const [selectedRuleForEdit, setSelectedRuleForEdit] = useState<Rule | null>(null);
  const [isAddingRule, setIsAddingRule] = useState<boolean>(false);
  const [localRules, setLocalRules] = useState<Rule[]>([]);
  
  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'warning', message: 'Alex tried to access blocked content', time: '2 min ago', read: false },
    { id: 2, type: 'info', message: 'New security rule activated', time: '5 min ago', read: false },
    { id: 3, type: 'success', message: 'Weekly report generated', time: '1 hour ago', read: true },
  ]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  
  // Activity logs - dynamic and synced with evaluations
  const [activityLogs, setActivityLogs] = useState([
    { id: 1, user: 'Alex', action: 'Blocked access to gaming site', url: 'game.com', time: dayjs().subtract(5, 'minutes'), type: 'block', rule: 'Gaming Block Rule' },
    { id: 2, user: 'Sarah', action: 'Allowed access to educational site', url: 'khan-academy.org', time: dayjs().subtract(15, 'minutes'), type: 'allow', rule: 'Educational Allow Rule' },
    { id: 3, user: 'Alex', action: 'Blocked social media access', url: 'instagram.com', time: dayjs().subtract(30, 'minutes'), type: 'block', rule: 'Social Media Block Rule' },
    { id: 4, user: 'Emma', action: 'Allowed access to homework help', url: 'homework-help.com', time: dayjs().subtract(1, 'hour'), type: 'allow', rule: 'Study Time Rule' },
    { id: 5, user: 'Alex', action: 'Blocked entertainment site', url: 'netflix.com', time: dayjs().subtract(2, 'hours'), type: 'block', rule: 'Screen Time Limit' },
  ]);
  
  // Reports data
  const [reportData, setReportData] = useState({
    weeklyStats: { blocked: 234, allowed: 1456, total: 1690 },
    topCategories: [
      { name: 'Gaming', blocked: 89, percentage: 38 },
      { name: 'Social Media', blocked: 67, percentage: 29 },
      { name: 'Entertainment', blocked: 45, percentage: 19 },
      { name: 'Shopping', blocked: 33, percentage: 14 },
    ]
  });

  const evaluateMutation = useMutation({
    mutationFn: async (payload: { userId: string; url: string; isoDateTime?: string }) =>
      (await axios.post(`${API_BASE}/evaluate`, payload)).data as { decision: 'allow' | 'block'; matchedRuleIds: string[]; reasons: string[] },
    onSuccess: (data, variables) => {
      // Add activity log when evaluation completes
      const user = allUsers.find(u => u.id === variables.userId);
      const matchedRule = data.matchedRuleIds.length > 0 ? 
        allRules.find(r => data.matchedRuleIds.includes(r.id))?.name || 'System Rule' : 
        'Default Policy';
      
      if (user) {
        addActivityLog(user.name, variables.url, data.decision, matchedRule);
      }
    }
  });

  // Combine API users with locally added users
  const allUsers = useMemo(() => {
    const apiUsers = usersQuery.data || [];
    return [...apiUsers, ...localUsers];
  }, [usersQuery.data, localUsers]);

  // Combine API rules with locally added rules
  const allRules = useMemo(() => {
    const apiRules = rulesQuery.data || [];
    return [...apiRules, ...localRules];
  }, [rulesQuery.data, localRules]);

  // Save local users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sentinel-local-users', JSON.stringify(localUsers));
  }, [localUsers]);

  const primaryUser = useMemo(() => allUsers[0]?.id ?? '', [allUsers]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Family Members', icon: Users },
    { id: 'rules', label: 'Parental Rules', icon: Shield },
    { id: 'activity', label: 'Activity Monitor', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setIsSearching(true);
      // Simulate search across different sections
      const results = [];
      
      // Search users
      const userResults = allUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
      ).map(user => ({ type: 'user', data: user, section: 'users' }));
      
      // Search rules
      const ruleResults = allRules.filter(rule => 
        rule.name.toLowerCase().includes(query.toLowerCase()) ||
        rule.expression.toLowerCase().includes(query.toLowerCase())
      ).map(rule => ({ type: 'rule', data: rule, section: 'rules' }));
      
      // Search activity logs
      const activityResults = activityLogs.filter(log => 
        log.user.toLowerCase().includes(query.toLowerCase()) ||
        log.url.toLowerCase().includes(query.toLowerCase())
      ).map(log => ({ type: 'activity', data: log, section: 'activity' }));
      
      setSearchResults([...userResults, ...ruleResults, ...activityResults]);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  // User management functions
  const handleAddUser = (userData: { name: string; role: 'child' | 'parent' | 'admin' }) => {
    // Create new user with unique ID
    const newUser: User = {
      id: `user_${Date.now()}`, // Generate unique ID
      name: userData.name,
      role: userData.role
    };
    
    // Add to local users state
    setLocalUsers(prev => [...prev, newUser]);
    
    // Show success notification
    const newNotification = {
      id: Date.now(),
      type: 'success' as const,
      message: `${userData.name} has been added to your family`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    console.log('Added user:', newUser);
    
    setIsAddingUser(false);
    setIsUserModalOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUserForEdit(user);
    setIsAddingUser(false);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user && confirm(`Are you sure you want to remove ${user.name} from your family?`)) {
      // Remove from local users if it's a locally added user
      if (userId.startsWith('user_')) {
        setLocalUsers(prev => prev.filter(u => u.id !== userId));
      }
      // Note: API users would need API call to delete
      
      // Show notification
      const newNotification = {
        id: Date.now(),
        type: 'info' as const,
        message: `${user.name} has been removed from your family`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      console.log('Deleted user:', userId);
    }
  };

  // Notification functions
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Rule management functions
  const handleAddRule = (ruleData: { name: string; expression: string; effect: 'allow' | 'block'; priority: number; category: string }) => {
    const newRule: Rule = {
      id: `rule_${Date.now()}`,
      name: ruleData.name,
      expression: ruleData.expression,
      effect: ruleData.effect,
      priority: ruleData.priority,
      enabled: true
    };
    
    setLocalRules(prev => [...prev, newRule]);
    
    const newNotification = {
      id: Date.now(),
      type: 'success' as const,
      message: `New ${ruleData.effect} rule "${ruleData.name}" has been created`,
      time: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    console.log('Added rule:', newRule);
    setIsAddingRule(false);
    setIsRuleModalOpen(false);
  };

  const handleEditRule = (rule: Rule) => {
    setSelectedRuleForEdit(rule);
    setIsAddingRule(false);
    setIsRuleModalOpen(true);
  };

  const handleDeleteRule = (ruleId: string) => {
    const rule = allRules.find(r => r.id === ruleId);
    if (rule && confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
      if (ruleId.startsWith('rule_')) {
        setLocalRules(prev => prev.filter(r => r.id !== ruleId));
      }
      
      const newNotification = {
        id: Date.now(),
        type: 'info' as const,
        message: `Rule "${rule.name}" has been deleted`,
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      console.log('Deleted rule:', ruleId);
    }
  };

  const handleToggleRule = (ruleId: string) => {
    console.log('Toggling rule:', ruleId);
    
    if (ruleId.startsWith('rule_')) {
      // Handle locally created rules
      setLocalRules(prev => prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      ));
      
      // Show notification
      const rule = allRules.find(r => r.id === ruleId);
      if (rule) {
        const newNotification = {
          id: Date.now(),
          type: 'success' as const,
          message: `Rule "${rule.name}" ${rule.enabled ? 'disabled' : 'enabled'}`,
          time: 'Just now',
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    } else {
      // Handle API rules - for now we'll just show a notification
      const rule = allRules.find(r => r.id === ruleId);
      if (rule) {
        const newNotification = {
          id: Date.now(),
          type: 'info' as const,
          message: `Rule "${rule.name}" toggle would require API call`,
          time: 'Just now',
          read: false
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }
  };

  // Add activity log when evaluation happens
  const addActivityLog = (user: string, url: string, decision: 'allow' | 'block', matchedRule?: string) => {
    const newLog = {
      id: Date.now(),
      user,
      action: decision === 'allow' ? `Allowed access to ${url}` : `Blocked access to ${url}`,
      url,
      time: dayjs(),
      type: decision,
      rule: matchedRule || 'Default Rule'
    };
    
    setActivityLogs(prev => [newLog, ...prev.slice(0, 19)]); // Keep only last 20 logs
  };

  const handleLampAnimationComplete = () => {
    setShowLampAnimation(false);
  };

  // Show lamp animation on first load
  if (showLampAnimation) {
    return <LampAnimation onComplete={handleLampAnimationComplete} />;
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-purple-900/20"></div>
      
      {/* Comprehensive Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-slate-900/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-2.5 shadow-2xl shadow-blue-500/25">
                  <Shield className="h-full w-full text-white" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Sentinel
                </h1>
                <p className="text-sm text-slate-400 font-medium tracking-wide whitespace-nowrap">
                  Parental Control System
                </p>
              </div>
            </div>

            {/* Desktop Navigation with Card Hover Effects */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id} 
                    className="relative group block p-1 h-full w-full"
                    onMouseEnter={() => {}}
                    onMouseLeave={() => {}}
                  >
                    {/* Animated Background */}
                    <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`relative z-20 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 w-full ${
                        activeSection === item.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/25'
                          : 'text-slate-300 hover:text-white group-hover:bg-slate-700/30'
                      }`}
                    >
                      <Icon className={`h-4 w-4 transition-all duration-300 ${
                        activeSection === item.id ? 'scale-110 text-blue-400' : 'group-hover:scale-110 group-hover:text-white'
                      }`} />
                      <span className="transition-all duration-300 group-hover:text-white">
                        {item.label}
                      </span>
                      
                      {/* Active Indicator */}
                      {activeSection === item.id && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      )}
                    </button>
                  </div>
                );
              })}
            </nav>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
              {/* Functional Search */}
              <div className="hidden lg:block relative">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg min-w-[280px]">
                  <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search family data..." 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-full"
                  />
                  {isSearching && (
                    <RefreshCw className="h-3 w-3 text-blue-400 animate-spin" />
                  )}
                </div>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-slate-700">
                      <p className="text-sm font-medium text-white">Search Results ({searchResults.length})</p>
                    </div>
                    {searchResults.map((result, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveSection(result.section);
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        className="w-full p-3 text-left hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${
                            result.type === 'user' ? 'bg-blue-500/10' :
                            result.type === 'rule' ? 'bg-purple-500/10' : 'bg-green-500/10'
                          }`}>
                            {result.type === 'user' ? <Users className="h-3 w-3 text-blue-400" /> :
                             result.type === 'rule' ? <Shield className="h-3 w-3 text-purple-400" /> :
                             <Activity className="h-3 w-3 text-green-400" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {result.type === 'user' ? result.data.name :
                               result.type === 'rule' ? result.data.name :
                               result.data.action}
                            </p>
                            <p className="text-xs text-slate-400 capitalize">{result.type}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Interactive Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{unreadNotifications}</span>
                    </div>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 border-b border-slate-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">Family Notifications</h3>
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-slate-700/50 last:border-b-0 ${
                            !notification.read ? 'bg-blue-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-1.5 rounded-lg ${
                              notification.type === 'warning' ? 'bg-yellow-500/10' :
                              notification.type === 'info' ? 'bg-blue-500/10' : 'bg-green-500/10'
                            }`}>
                              {notification.type === 'warning' ? <AlertTriangle className="h-3 w-3 text-yellow-400" /> :
                               notification.type === 'info' ? <Bell className="h-3 w-3 text-blue-400" /> :
                               <CheckCircle className="h-3 w-3 text-green-400" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-white">{notification.message}</p>
                              <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="p-1 text-blue-400 hover:text-blue-300"
                              >
                                <Eye className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">Online</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-slate-700/50">
              <div className="grid grid-cols-2 gap-2 mt-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Render Different Sections Based on Active Navigation */}
        {activeSection === 'dashboard' && (
          <>
            {/* Stats Dashboard with Hover Effects */}
            <HoverEffect
              className="mb-8"
              items={[
                {
                  title: "Family Members",
                  description: "Total family members",
                  value: allUsers.length,
                  icon: <Users className="h-5 w-5 text-blue-400" />,
                  color: "bg-blue-500/10"
                },
                {
                  title: "Active Rules",
                  description: "Parental control rules enabled",
                  value: allRules.filter(r => r.enabled).length,
                  icon: <Shield className="h-5 w-5 text-purple-400" />,
                  color: "bg-purple-500/10"
                },
                {
                  title: "System Status",
                  description: "Current operational state",
                  value: "Operational",
                  icon: <CheckCircle className="h-5 w-5 text-green-400" />,
                  color: "bg-green-500/10"
                },
                {
                  title: "AI Engine",
                  description: "Machine learning status",
                  value: "Active",
                  icon: <Zap className="h-5 w-5 text-orange-400" />,
                  color: "bg-orange-500/10"
                }
              ]}
            />

            <div className="grid lg:grid-cols-3 gap-8">
          {/* Access Evaluation Panel */}
          <section className="lg:col-span-2 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Access Evaluation</h2>
                <p className="text-sm text-slate-400">Test URL access permissions with AI-powered analysis</p>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Select User</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    value={selectedUser || primaryUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.id} className="bg-slate-800">{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Date & Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" 
                    type="datetime-local" 
                    value={dayjs(iso).format('YYYY-MM-DDTHH:mm')} 
                    onChange={(e) => setIso(dayjs(e.target.value).toISOString())} 
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-slate-300">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" 
                    value={testUrl} 
                    onChange={(e) => setTestUrl(e.target.value)} 
                    placeholder="https://example.com" 
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2 flex gap-4">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => evaluateMutation.mutate({ userId: selectedUser || primaryUser, url: testUrl, isoDateTime: iso })}
                  disabled={evaluateMutation.isPending}
                >
                  {evaluateMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Evaluate Access
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            {evaluateMutation.data && (
              <div className="mt-8 p-6 rounded-2xl border border-slate-600/50 bg-slate-700/30 backdrop-blur">
                <div className="flex items-center gap-4 mb-4">
                  {evaluateMutation.data.decision === 'allow' ? (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-green-400">ACCESS GRANTED</div>
                        <div className="text-sm text-slate-400">Request approved by security policy</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-red-500/10 rounded-lg">
                        <XCircle className="h-6 w-6 text-red-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-red-400">ACCESS DENIED</div>
                        <div className="text-sm text-slate-400">Request blocked by security policy</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Policy Analysis
                  </h4>
                  <div className="space-y-2">
                    {evaluateMutation.data.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 bg-slate-800/50 rounded-lg">
                        <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-slate-300">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {!evaluateMutation.data && !evaluateMutation.isPending && (
              <div className="mt-8 p-6 rounded-2xl border border-slate-600/30 bg-slate-700/20 text-center">
                <div className="p-3 bg-slate-600/20 rounded-full w-fit mx-auto mb-3">
                  <Globe className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-400">Enter a website URL above and click "Evaluate Access" to analyze permissions</p>
              </div>
            )}
        </section>

          {/* Security Rules Panel with Infinite Moving Cards */}
          <aside className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Security Rules</h2>
                <p className="text-sm text-slate-400">Active protection policies in motion</p>
              </div>
            </div>
            
            {rulesQuery.data && rulesQuery.data.length > 0 ? (
              <div className="relative">
                <InfiniteMovingCards
                  items={rulesQuery.data.sort((a,b)=>b.priority-a.priority)}
                  direction="left"
                  speed="slow"
                  pauseOnHover={true}
                  className="mb-4"
                />
                
                {/* Static fallback for small screens */}
                <div className="md:hidden space-y-4 max-h-[400px] overflow-auto pr-2">
                  {rulesQuery.data.sort((a,b)=>b.priority-a.priority).slice(0, 3).map((r) => (
                    <div key={r.id} className="p-4 rounded-xl border border-slate-600/30 bg-slate-700/20">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {r.effect === 'allow' ? (
                              <CheckCircle className="h-4 w-4 text-green-400" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                            <h3 className="font-semibold text-white text-sm">{r.name}</h3>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className={`px-2 py-1 rounded-full font-medium ${
                              r.effect === 'allow' 
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {r.effect.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full font-medium">
                              Priority: {r.priority}
                            </span>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.enabled 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                            : 'bg-slate-600/20 text-slate-400 border border-slate-600/20'
                        }`}>
                          {r.enabled ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-300 font-mono leading-relaxed">{r.expression}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : rulesQuery.isPending ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <span className="ml-2 text-slate-400">Loading security rules...</span>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400">No security rules configured</p>
              </div>
            )}
          </aside>
            </div>
          </>
        )}


        {/* Family Members Management Section */}
        {activeSection === 'users' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Family Members</h2>
                  <p className="text-slate-400">Manage your family's digital safety settings</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsAddingUser(true);
                  setSelectedUserForEdit(null);
                  setIsUserModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Add Family Member
              </button>
            </div>

            {/* Family Members Grid with Enhanced Hover Effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="relative group bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 hover:scale-[1.02]"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                          <span className="text-white font-bold text-lg">{user.name.charAt(0)}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-400"></div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-blue-100 transition-colors duration-300">{user.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            user.role === 'parent' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20 group-hover:bg-green-500/20' 
                              : user.role === 'admin'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20'
                          }`}>
                            {user.role === 'parent' ? '👨‍👩‍👧‍👦 Parent' : user.role === 'admin' ? '👑 Admin' : '👶 Child'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats for Children */}
                    {user.role === 'child' && (
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Screen Time Today</span>
                          <span className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors duration-300">2h 15m / 3h</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2 group-hover:bg-slate-700/70 transition-all duration-300">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Sites Blocked Today</span>
                          <span className="text-red-400 font-medium group-hover:text-red-300 transition-colors duration-300">12</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-sm hover:scale-105"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          // Quick action - toggle monitoring
                          console.log('Toggle monitoring for', user.name);
                        }}
                        className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-all hover:scale-105"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Member Card */}
              <button
                onClick={() => {
                  setIsAddingUser(true);
                  setSelectedUserForEdit(null);
                  setIsUserModalOpen(true);
                }}
                className="bg-slate-800/20 border-2 border-dashed border-slate-600/50 rounded-2xl p-6 hover:bg-slate-800/30 hover:border-slate-500/50 transition-all group flex flex-col items-center justify-center min-h-[200px]"
              >
                <div className="p-4 bg-blue-500/10 rounded-full mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Plus className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Add Family Member</h3>
                <p className="text-slate-400 text-sm text-center">Create a new profile for your family member</p>
              </button>
            </div>

            {/* Family Overview Stats */}
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-400" />
                Family Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{allUsers.filter(u => u.role === 'child').length}</div>
                  <div className="text-sm text-slate-400">Children</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">89%</div>
                  <div className="text-sm text-slate-400">Safe Browsing</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">4.2h</div>
                  <div className="text-sm text-slate-400">Avg Screen Time</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">156</div>
                  <div className="text-sm text-slate-400">Blocks Today</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Monitor Section */}
        {activeSection === 'activity' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Activity Monitor</h2>
                <p className="text-slate-400">Real-time family internet activity</p>
              </div>
            </div>

            {/* Sticky Scroll Activity Timeline */}
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden">
              <StickyScroll
                content={[
                  {
                    title: "Real-Time Monitoring",
                    description: "Track all family internet activity in real-time with detailed logs and instant notifications for blocked or allowed content.",
                    content: (
                      <div className="h-full w-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white">
                        <div className="text-center">
                          <Activity className="h-16 w-16 mx-auto mb-4" />
                          <h3 className="text-xl font-bold mb-2">Live Activity</h3>
                          <p className="text-sm opacity-80">Monitoring {allUsers.length} family members</p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Smart Filtering",
                    description: "Advanced content filtering with AI-powered categorization and custom rule matching for comprehensive protection.",
                    content: (
                      <div className="h-full w-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white">
                        <div className="text-center">
                          <Shield className="h-16 w-16 mx-auto mb-4" />
                          <h3 className="text-xl font-bold mb-2">Smart Protection</h3>
                          <p className="text-sm opacity-80">{allRules.filter(r => r.enabled).length} active rules</p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Detailed Analytics",
                    description: "Comprehensive reports and analytics showing browsing patterns, blocked attempts, and safety metrics for each family member.",
                    content: (
                      <div className="h-full w-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                        <div className="text-center">
                          <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                          <h3 className="text-xl font-bold mb-2">Analytics</h3>
                          <p className="text-sm opacity-80">{activityLogs.length} recent activities</p>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>

            {/* Recent Activity List */}
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm transition-colors">
                    <Filter className="h-4 w-4" />
                  </button>
                  <button className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-sm transition-colors">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className={`p-2 rounded-lg ${
                      log.type === 'block' ? 'bg-red-500/10' : 'bg-green-500/10'
                    }`}>
                      {log.type === 'block' ? 
                        <XCircle className="h-4 w-4 text-red-400" /> : 
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      }
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white font-medium">{log.user}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          log.type === 'block' 
                            ? 'bg-red-500/10 text-red-400' 
                            : 'bg-green-500/10 text-green-400'
                        }`}>
                          {log.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-1">{log.action}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>🌐 {log.url}</span>
                        <span>📋 {log.rule}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">{log.time.format('HH:mm')}</p>
                      <p className="text-slate-500 text-xs">{log.time.format('MMM DD')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {activityLogs.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reports Section */}
        {activeSection === 'reports' && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Family Reports</h2>
                <p className="text-slate-400">Weekly and monthly family activity reports</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">This Week's Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Requests</span>
                    <span className="text-white font-semibold">{reportData.weeklyStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Allowed</span>
                    <span className="text-green-400 font-semibold">{reportData.weeklyStats.allowed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Blocked</span>
                    <span className="text-red-400 font-semibold">{reportData.weeklyStats.blocked}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Blocked Categories</h3>
                <div className="space-y-3">
                  {reportData.topCategories.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">{category.name}</span>
                        <span className="text-slate-400 text-sm">{category.blocked} blocks</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Family Members Activity Report */}
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Family Members Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allUsers.map((user) => (
                  <div key={user.id} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{user.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.role === 'parent' ? 'bg-green-500/10 text-green-400' :
                          user.role === 'admin' ? 'bg-purple-500/10 text-purple-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Screen Time</span>
                        <span className={`font-medium ${
                          user.role === 'child' ? 'text-blue-400' : 
                          user.role === 'parent' ? 'text-green-400' : 'text-purple-400'
                        }`}>
                          {user.role === 'admin' ? 'Unlimited' : 
                           `${Math.floor(Math.random() * 15) + 5}h ${Math.floor(Math.random() * 60)}m`}
                        </span>
                      </div>
                      
                      {user.role === 'child' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Sites Blocked</span>
                            <span className="text-red-400 font-medium">{Math.floor(Math.random() * 20) + 5}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Safe Browsing</span>
                            <span className="text-green-400 font-medium">{Math.floor(Math.random() * 50) + 80}%</span>
                          </div>
                        </>
                      )}
                      
                      {user.role === 'parent' && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Monitoring</span>
                          <span className="text-green-400 font-medium">Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {allUsers.length === 0 && (
                  <div className="col-span-full text-center py-8 text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-lg font-medium mb-1">No Family Members</p>
                    <p className="text-sm">Add family members to see their activity reports</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Parental Rules Section */}
        {activeSection === 'rules' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Parental Rules</h2>
                  <p className="text-slate-400">Manage content filtering and access control rules</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsAddingRule(true);
                  setSelectedRuleForEdit(null);
                  setIsRuleModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg"
              >
                <Plus className="h-4 w-4" />
                Create Rule
              </button>
            </div>

            {/* Rules Grid with Enhanced Hover Effects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {allRules.sort((a,b)=>b.priority-a.priority).map((rule) => (
                <div 
                  key={rule.id} 
                  className="relative group bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 hover:scale-[1.02]"
                >
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                            rule.effect === 'allow' ? 'bg-green-500/10 group-hover:bg-green-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'
                          }`}>
                            {rule.effect === 'allow' ? 
                              <CheckCircle className="h-4 w-4 text-green-400" /> : 
                              <XCircle className="h-4 w-4 text-red-400" />
                            }
                          </div>
                          <h3 className="text-white font-semibold group-hover:text-blue-100 transition-colors duration-300">{rule.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                            rule.enabled 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20 group-hover:bg-green-500/20' 
                              : 'bg-slate-600/20 text-slate-400 border border-slate-600/20 group-hover:bg-slate-600/30'
                          }`}>
                            {rule.enabled ? 'ACTIVE' : 'INACTIVE'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                          <span className={`px-2 py-1 rounded-full font-medium transition-all duration-300 ${
                            rule.effect === 'allow' 
                              ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20' 
                              : 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'
                          }`}>
                            {rule.effect.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full font-medium group-hover:bg-blue-500/20 transition-all duration-300">
                            Priority: {rule.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-700/30 rounded-lg mb-4 group-hover:bg-slate-700/50 transition-all duration-300">
                      <p className="text-xs text-slate-300 font-mono leading-relaxed group-hover:text-slate-200 transition-colors duration-300">{rule.expression}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditRule(rule)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-all text-sm hover:scale-105"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleRule(rule.id);
                        }}
                        className={`px-3 py-2 rounded-lg transition-all hover:scale-105 cursor-pointer ${
                          rule.enabled 
                            ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 hover:shadow-lg hover:shadow-yellow-500/25' 
                            : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:shadow-lg hover:shadow-green-500/25'
                        }`}
                        title={rule.enabled ? 'Click to disable rule' : 'Click to enable rule'}
                      >
                        {rule.enabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all hover:scale-105"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Rule Card */}
            <div className="mt-6">
              <button
                onClick={() => {
                  setIsAddingRule(true);
                  setSelectedRuleForEdit(null);
                  setIsRuleModalOpen(true);
                }}
                className="bg-slate-800/20 border-2 border-dashed border-slate-600/50 rounded-2xl p-6 hover:bg-slate-800/30 hover:border-slate-500/50 transition-all group flex flex-col items-center justify-center min-h-[200px] w-full"
              >
                <div className="p-4 bg-purple-500/10 rounded-full mb-4 group-hover:bg-purple-500/20 transition-colors">
                  <Plus className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Create New Rule</h3>
                <p className="text-slate-400 text-sm text-center">Set up content filtering and access control</p>
              </button>
            </div>

            {/* Rules Overview */}
            <div className="bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-400" />
                Rules Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{allRules.length}</div>
                  <div className="text-sm text-slate-400">Total Rules</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">{allRules.filter(r => r.enabled).length}</div>
                  <div className="text-sm text-slate-400">Active Rules</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-1">{allRules.filter(r => r.effect === 'block').length}</div>
                  <div className="text-sm text-slate-400">Block Rules</div>
                </div>
                <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{allRules.filter(r => r.effect === 'allow').length}</div>
                  <div className="text-sm text-slate-400">Allow Rules</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Family-Friendly Footer */}
      <footer className="mt-16 border-t border-slate-700/50 bg-slate-800/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-1.5">
                <Shield className="h-full w-full text-white" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-white font-semibold">Sentinel</p>
                <p className="text-xs text-slate-400">Parental Control System</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-slate-300">© {new Date().getFullYear()} Sentinel Family Safety</p>
              <p className="text-xs text-slate-400">Keeping families safe online</p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-green-400">Family Protected</span>
            </div>
          </div>
        </div>
      </footer>

      {/* User Management Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUserForEdit(null);
          setIsAddingUser(false);
        }}
        user={selectedUserForEdit}
        onSave={handleAddUser}
        onDelete={handleDeleteUser}
        isAdding={isAddingUser}
      />

      {/* Rule Management Modal */}
      <RuleModal
        isOpen={isRuleModalOpen}
        onClose={() => {
          setIsRuleModalOpen(false);
          setSelectedRuleForEdit(null);
          setIsAddingRule(false);
        }}
        rule={selectedRuleForEdit}
        onSave={handleAddRule}
        onDelete={handleDeleteRule}
        isAdding={isAddingRule}
      />
    </div>
  );
}


