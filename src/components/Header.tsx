import React, { useState } from 'react';
import { LogOut, User, Menu, X, Home, FileText, LayoutDashboard, BarChart3 } from 'lucide-react';
import { Page } from '../App';
import './logoacm.png';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: { email: string; name: string };
  onLogout: () => void;
}

export function Header({ currentPage, onNavigate, user, onLogout }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  
  const navItems = [
    { id: 'home' as Page, label: 'Home', icon: Home },
    { id: 'proposal' as Page, label: 'Submit Proposal', icon: FileText },
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports' as Page, label: 'Reports', icon: BarChart3 }
  ];

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    setShowDrawer(false);
  };

  const closeMenus = () => {
    setShowUserMenu(false);
    setShowDrawer(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <img src='src\assets\acm-logo.png' alt="ACM Logo" className="w-10 h-10" />
              <div>
                <h1 className="font-semibold text-gray-900">ACM Event Manager</h1>
                <p className="text-xs text-gray-500">Technical Club</p>
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                aria-expanded={showUserMenu}
                aria-haspopup="menu"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[150px] truncate">
                  {user.name}
                </span>
              </button>

              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        closeMenus();
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Overlay */}
      {showDrawer && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={closeMenus}
        />
      )}

      {/* Drawer Panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          showDrawer ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img src='src\assets\acm-logo.png' alt="ACM Logo" className="w-10 h-10" />
              <div>
                <h2 className="font-semibold text-gray-900">ACM Event Manager</h2>
                <p className="text-xs text-gray-500">Navigation Menu</p>
              </div>
            </div>
            <button
              onClick={() => setShowDrawer(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                closeMenus();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </header>
  );
}