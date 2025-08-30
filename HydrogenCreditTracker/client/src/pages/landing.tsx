import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/stats-cards";
import { Search, Store, Shield, CheckCircle, Globe, ArrowRightLeft } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Shield,
      title: "Fraud Prevention",
      description: "Blockchain-based double-counting prevention and immutable audit trails",
      color: "text-primary",
      hoverColor: "hover:border-primary/50",
    },
    {
      icon: Globe,
      title: "Global Compliance",
      description: "DID-based verification supporting international regulatory standards",
      color: "text-secondary",
      hoverColor: "hover:border-secondary/50",
    },
    {
      icon: ArrowRightLeft,
      title: "Fractionalized Trading",
      description: "Split credits for micro-transactions and improved liquidity",
      color: "text-primary",
      hoverColor: "hover:border-primary/50",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen particle-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Hero Icon */}
            <div className="flex justify-center mb-8">
              <div className="text-8xl text-primary glow-effect animate-pulse-glow">
                ⚡
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Green Hydrogen Credit <br/>
              <span className="gradient-text">Tracking System</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Traceable, Transparent, Fraud-Proof Hydrogen Economy. 
              Track, trade, and retire green hydrogen credits with blockchain transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/explorer">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold glow-effect" data-testid="button-explore-credits">
                  <Search className="mr-2 h-5 w-5" />
                  Explore Credits
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 rounded-lg font-semibold" data-testid="button-marketplace">
                  <Store className="mr-2 h-5 w-5" />
                  Marketplace
                </Button>
              </Link>
              <Link href="/regulator">
                <Button variant="outline" className="border-border hover:bg-accent text-foreground px-8 py-4 rounded-lg font-semibold" data-testid="button-regulator-login">
                  <Shield className="mr-2 h-5 w-5" />
                  Regulator Login
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <StatsCards />
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose HydroChain?</h2>
            <p className="text-xl text-muted-foreground">Built for the future of green energy verification</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-card border border-border rounded-xl p-8 text-center group transition-colors ${feature.hoverColor}`}
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className={`text-4xl ${feature.color} mb-4`}>
                  <feature.icon className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Hydrogen Trading?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the future of sustainable energy with transparent, secure, and efficient hydrogen credit tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/profile">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg glow-effect" data-testid="button-get-started">
                Get Started Today
              </Button>
            </Link>
            <Button variant="outline" className="px-8 py-4 text-lg" data-testid="button-learn-more">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
