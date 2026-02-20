import MarketplaceHeader from "./MarketplaceHeader";
import MarketplaceFooter from "./MarketplaceFooter";

interface MarketplaceLayoutProps {
  children: React.ReactNode;
}

const MarketplaceLayout = ({ children }: MarketplaceLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketplaceHeader />
      <main className="flex-1">{children}</main>
      <MarketplaceFooter />
    </div>
  );
};

export default MarketplaceLayout;
