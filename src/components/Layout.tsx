import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Store, Tag, Package, ShoppingCart,
  BarChart2, Gift, Menu, X, TrendingUp, Bell, ChevronDown
} from 'lucide-react';

const navItems = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/admin/dashboard' },
  {
    section: 'GESTION',
    items: [
      { label: 'Commerçants', icon: Store, path: '/admin/merchants' },
      { label: 'Promotions Type', icon: Tag, path: '/admin/promotion-loyalty' },
      { label: 'Produits', icon: Package, path: '/admin/products' },
      { label: 'Categories', icon: Package, path: '/admin/categories' },
    ],
  },
  {
    section: 'OPÉRATIONS',
    items: [
      { label: 'Commandes', icon: ShoppingCart, path: '/admin/orders' },
      { label: 'Stocks', icon: BarChart2, path: '/admin/stock' },
      { label: 'Promotions', icon: Gift, path: '/admin/promotions' },
    ],
  },
];

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function Layout({ children, title, subtitle }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? '' : 'sidebar-hidden'}`}
        style={{ transform: sidebarOpen || window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)' }}>

        {/* Logo */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid hsl(var(--sidebar-border))',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            width: '2.25rem', height: '2.25rem',
            background: 'hsl(var(--primary))',
            borderRadius: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingUp size={18} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white', lineHeight: 1.2 }}>CommerceHub</div>
            <div style={{ fontSize: '0.7rem', color: 'hsl(var(--sidebar-text))', letterSpacing: '0.05em' }}>Gestion Commerciale</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: '0.5rem', paddingBottom: '1rem', overflowY: 'auto' }}>
          {/* Direct items */}
          {navItems.filter(i => !('section' in i)).map((item: any) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}

          {/* Sectioned items */}
          {navItems.filter(i => 'section' in i).map((section: any) => (
            <div key={section.section}>
              <div className="sidebar-section">{section.section}</div>
              {section.items.map((item: any) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div style={{
          borderTop: '1px solid hsl(var(--sidebar-border))',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div className="avatar" style={{ background: 'hsl(var(--primary))' }}>A</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin</div>
            <div style={{ fontSize: '0.7rem', color: 'hsl(var(--sidebar-text))' }}>Administrateur</div>
          </div>
          <ChevronDown size={14} color="hsl(var(--sidebar-text))" />
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 35 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="main-content" style={{ flex: 1 }}>
        {/* Topbar */}
        <header className="topbar">
          <button className="btn-ghost" style={{ marginRight: '1rem', display: 'none' }} onClick={() => setSidebarOpen(true)}>
            <Menu size={18} />
          </button>

          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{title}</h1>
            {subtitle && <p style={{ fontSize: '0.8rem', color: 'hsl(var(--muted-foreground))', margin: 0 }}>{subtitle}</p>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn-ghost" style={{ position: 'relative', padding: '0.5rem' }}>
              <Bell size={18} />
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: 'hsl(var(--destructive))',
                border: '2px solid hsl(var(--card))',
              }} />
            </button>
            <div className="avatar" style={{ background: 'hsl(var(--primary))', cursor: 'pointer' }}>A</div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
