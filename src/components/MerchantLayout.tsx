import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Tag, Package, ShoppingCart,
    BarChart2, Gift, Menu, Bell, LogOut
} from 'lucide-react';
import Logo from '@/assets/Logo.png';

const navItems = [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/merchant/dashboard' },
    {
        section: 'GESTION',
        items: [
            { label: 'Promotions Type', icon: Tag, path: '/merchant/promotion-loyalty' },
            { label: 'Produits', icon: Package, path: '/merchant/products' },
            { label: 'Categories', icon: Package, path: '/merchant/categories' },
        ],
    },
    {
        section: 'OPÉRATIONS',
        items: [
            { label: 'Commandes', icon: ShoppingCart, path: '/merchant/orders' },
            { label: 'Stocks', icon: BarChart2, path: '/merchant/stock' },
            { label: 'Promotions', icon: Gift, path: '/merchant/promotions' },
        ],
    },
];

interface LayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export function MerchantLayout({ children, title, subtitle }: LayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        // Supprime les données d'authentification
        localStorage.removeItem("mc_token");
        localStorage.removeItem("mc_user");

        // Redirection vers la page login /
        navigate("/", { replace: true });
    };
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>

            {/* Sidebar */}
            <aside
                className={`sidebar ${sidebarOpen ? '' : 'sidebar-hidden'}`}
                style={{
                    transform:
                        sidebarOpen || window.innerWidth >= 1024
                            ? 'translateX(0)'
                            : 'translateX(-100%)',
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid hsl(var(--sidebar-border))',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    {/* Logo image */}
                    <div
                        style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'transparent', // on peut garder transparent si l'image a son fond
                        }}
                    >
                        <img
                            src={Logo}
                            alt="Logo MarketCom+"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }}
                        />
                    </div>

                    {/* Texte */}
                    <div>
                        <div
                            style={{
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                color: 'white',
                                lineHeight: 1.2,
                            }}
                        >
                            MarketCom +
                        </div>
                        <div
                            style={{
                                fontSize: '0.7rem',
                                color: 'hsl(var(--sidebar-text))',
                                letterSpacing: '0.05em',
                            }}
                        >
                            Gestion Commerciale
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav
                    style={{
                        flex: 1,
                        paddingTop: '0.5rem',
                        paddingBottom: '1rem',
                        overflowY: 'auto',
                    }}
                >
                    {/* Items directs */}
                    {navItems
                        .filter((i) => !('section' in i))
                        .map((item: any) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${location.pathname === item.path ? 'active' : ''
                                    }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        ))}

                    {/* Sections */}
                    {navItems
                        .filter((i) => 'section' in i)
                        .map((section: any) => (
                            <div key={section.section}>
                                <div className="sidebar-section">
                                    {section.section}
                                </div>
                                {section.items.map((item: any) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`sidebar-link ${location.pathname === item.path ? 'active' : ''
                                            }`}
                                        onClick={() => setSidebarOpen(false)}
                                    >
                                        <item.icon size={18} />
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                </nav>

                {/* Footer utilisateur */}
                <div
                    style={{
                        borderTop: '1px solid hsl(var(--sidebar-border))',
                        padding: '1rem 1.25rem',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between', // espace entre infos et logout
                            gap: '0.75rem',
                        }}
                    >
                        {/* Avatar + infos */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div
                                className="avatar"
                                style={{ background: 'hsl(var(--primary))', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}
                            >
                                M
                            </div>
                            <div>
                                <div
                                    style={{
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        color: 'white',
                                    }}
                                >
                                    Merchant
                                </div>
                                <div
                                    style={{
                                        fontSize: '0.7rem',
                                        color: 'hsl(var(--sidebar-text))',
                                    }}
                                >
                                    Commercant
                                </div>
                            </div>
                        </div>

                        {/* Logout icône */}
                        <button
                            onClick={handleLogout}
                            className="sidebar-link"
                            style={{
                                justifyContent: 'center',
                                color: 'hsl(var(--destructive))',
                                padding: '0.5rem',
                            }}
                            title="Déconnexion"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay mobile */}
            {sidebarOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.4)',
                        zIndex: 35,
                    }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main */}
            <div className="main-content" style={{ flex: 1 }}>
                {/* Topbar */}
                <header className="topbar">
                    <button
                        className="btn-ghost"
                        style={{ marginRight: '1rem' }}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={18} />
                    </button>

                    <div style={{ flex: 1 }}>
                        <h1
                            style={{
                                fontSize: '1.1rem',
                                fontWeight: 700,
                                margin: 0,
                            }}
                        >
                            {title}
                        </h1>
                        {subtitle && (
                            <p
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'hsl(var(--muted-foreground))',
                                    margin: 0,
                                }}
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                        }}
                    >
                        <button
                            className="btn-ghost"
                            style={{ position: 'relative', padding: '0.5rem' }}
                        >
                            <Bell size={18} />
                            <span
                                style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: 'hsl(var(--destructive))',
                                }}
                            />
                        </button>

                        <div
                            className="avatar"
                            style={{
                                background: 'hsl(var(--primary))',
                                cursor: 'pointer',
                            }}
                        >
                                M
                        </div>
                    </div>
                </header>

                {/* Contenu page */}
                <main style={{ padding: '1.5rem' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
