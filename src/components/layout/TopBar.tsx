// ============================================================
// BUILDCORE ERP - TOP BAR & COMMAND CENTER
// ============================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, Moon, Sun, Monitor, Menu, User, LogOut,
  Settings, ChevronDown, Command,
  Building2, FileText, Truck, Users, DollarSign, HardHat, Package
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useThemeStore, useAuthStore, useAppStore } from '../../store';
import { searchService, notificationService } from '../../services';
import type { SearchResult, ThemeMode } from '../../types';

// ============================================================
// COMMAND CENTER
// ============================================================
interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandCenter({ isOpen, onClose }: CommandCenterProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (q.length >= 2) {
      const user = useAuthStore.getState().user;
      const searchResults = searchService.search(q, user?.id || 'usr_001');
      setResults(searchResults);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const moduleIcons: Record<string, React.ReactNode> = {
    projects: <Building2 className="w-4 h-4 text-blue-500" />,
    procurement: <Truck className="w-4 h-4 text-orange-500" />,
    people: <Users className="w-4 h-4 text-green-500" />,
    materials: <Package className="w-4 h-4 text-purple-500" />,
    billing: <DollarSign className="w-4 h-4 text-emerald-500" />,
    reports: <FileText className="w-4 h-4 text-indigo-500" />,
    contracts: <FileText className="w-4 h-4 text-teal-500" />,
    plant: <HardHat className="w-4 h-4 text-amber-500" />,
    vendors: <Users className="w-4 h-4 text-pink-500" />,
    rmc: <HardHat className="w-4 h-4 text-cyan-500" />,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, POs, vendors, materials, reports..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-base outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto">
              {query.length < 2 ? (
                <div className="p-6">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'New Purchase Requisition', icon: <FileText className="w-4 h-4" />, module: 'procurement' },
                      { label: 'Create Project', icon: <Building2 className="w-4 h-4" />, module: 'projects' },
                      { label: 'View Pending Approvals', icon: <DollarSign className="w-4 h-4" />, module: 'approvals' },
                      { label: 'Site Attendance', icon: <Users className="w-4 h-4" />, module: 'labour' },
                    ].map((action, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                        onClick={onClose}
                      >
                        <div className="text-gray-400">{action.icon}</div>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 mt-6">Recent</p>
                  <div className="space-y-1">
                    {['Mumbai-Pune Expressway Widening', 'PO-2026-000012', 'Tata Steel Ltd'].map((item, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full text-left"
                        onClick={onClose}
                      >
                        <Search className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {results.length} result{results.length > 1 ? 's' : ''}
                  </p>
                  {results.map((result, idx) => (
                    <button
                      key={result.id}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        idx === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={onClose}
                    >
                      <div className="flex-shrink-0">
                        {moduleIcons[result.module] || <Search className="w-4 h-4 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{result.subtitle} {result.description && `· ${result.description}`}</p>
                      </div>
                      <span className="text-[10px] font-medium text-gray-400 uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                        {result.module}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500">No results found for "{query}"</p>
                  <p className="text-xs text-gray-400 mt-1">Try searching for projects, vendors, or documents</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-4 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">↵</kbd> Open</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">esc</kbd> Close</span>
              </div>
              <span className="text-[10px] text-gray-400">BuildCore Command Center</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================================
// TOP BAR
// ============================================================
interface TopBarProps {
  onMenuClick: () => void;
  breadcrumbs: { label: string; url?: string }[];
}

export function TopBar({ onMenuClick, breadcrumbs }: TopBarProps) {
  const { mode, resolvedTheme, setMode } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, commandCenterOpen, setCommandCenterOpen, markNotificationRead, markAllNotificationsRead } = useAppStore();
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Keyboard shortcut for command center
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandCenterOpen(!commandCenterOpen);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandCenterOpen, setCommandCenterOpen]);

  const themeIcons = { light: <Sun className="w-4 h-4" />, dark: <Moon className="w-4 h-4" />, system: <Monitor className="w-4 h-4" /> };
  const nextMode: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
                <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center - Command Bar */}
        <button
          onClick={() => setCommandCenterOpen(true)}
          className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors min-w-[320px] max-w-md"
        >
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 flex-1 text-left">Search anything...</span>
          <kbd className="flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
            <Command className="w-3 h-3" />K
          </kbd>
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button onClick={() => setCommandCenterOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setMode(nextMode[mode])}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={`Theme: ${mode}`}
          >
            {themeIcons[mode]}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full min-w-[18px] h-[18px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotif && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                      <button onClick={() => { markAllNotificationsRead(); }} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.slice(0, 6).map(notif => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${!notif.isRead ? 'bg-blue-500' : 'bg-transparent'}`} />
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-900 dark:text-white">{notif.title}</p>
                              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-700">
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{user?.designation}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden lg:block" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      {[
                        { icon: <User className="w-4 h-4" />, label: 'My Profile' },
                        { icon: <Settings className="w-4 h-4" />, label: 'Settings' },
                      ].map((item, i) => (
                        <button key={i} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-1.5 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => { logout(); setShowProfile(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Command Center */}
      <CommandCenter isOpen={commandCenterOpen} onClose={() => setCommandCenterOpen(false)} />
    </>
  );
}
