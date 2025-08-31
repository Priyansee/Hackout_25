import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Shield, BarChart3, Globe, Users, Zap, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold">Green H2 Credits</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/explorer")}>
                Explorer
              </Button>
              <Button variant="ghost" onClick={() => navigate("/trading")}>
                Trading
              </Button>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Regulator
              </Button>
              <Button onClick={() => navigate("/auth")}>
                <LogIn className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-sm animate-float" />
        <div className="absolute top-40 right-20 w-12 h-12 bg-accent/20 rounded-full blur-sm animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-8 h-8 bg-blockchain/20 rounded-full blur-sm animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 z-10">
          <div className="text-center">
            <Badge className="mb-6 animate-pulse-slow glass-effect" variant="secondary">
              <Leaf className="w-4 h-4 mr-2" />
              🌱 Carbon Neutral • Blockchain Verified
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
              <span style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Green Hydrogen
              </span>
              <br />
              <span className="text-foreground">Credits</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed">
              The world's first blockchain-powered platform for issuing, trading, and verifying green hydrogen credits with fraud-proof transparency and real-time settlement.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-lg px-10 py-4 hover-lift animate-glow" onClick={() => navigate("/trading")}>
                <Zap className="w-5 h-5 mr-2" />
                Start Trading Credits
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-4 hover-lift" onClick={() => navigate("/explorer")}>
                <Shield className="w-5 h-5 mr-2" />
                Explore Platform
              </Button>
            </div>
            
            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$2.4B</div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">99.9%</div>
                <div className="text-sm text-muted-foreground">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">847</div>
                <div className="text-sm text-muted-foreground">Credits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blockchain">24/7</div>
                <div className="text-sm text-muted-foreground">Trading</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Three Revolutionary Features
          </h2>
          <p className="text-xl text-muted-foreground">
            Built for producers, traders, regulators, and ESG investors
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group hover-lift cursor-pointer" onClick={() => navigate("/explorer")}>
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-8 h-8 text-primary animate-pulse-slow" />
              </div>
              <CardTitle className="text-xl">Hydrogen Digital Passport</CardTitle>
              <CardDescription>
                Every credit is a smart-contract-backed token with full traceability from production to retirement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  Verified producer origins & certificates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  Complete lifecycle tracking
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  Blockchain-based immutable records
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                  Real-time explorer dashboard
                </li>
              </ul>
              <Button variant="ghost" className="w-full mt-4 group-hover:bg-primary/10">
                Explore Passports →
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover-lift cursor-pointer" onClick={() => navigate("/trading")}>
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="w-8 h-8 text-accent animate-pulse-slow" />
              </div>
              <CardTitle className="text-xl">Fraud-Proof Exchange</CardTitle>
              <CardDescription>
                NFT-based credits with real-time trading, verified identities, and smart contract settlement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Fractionalized NFT credit tokens
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  DID-verified traders only
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Zero double counting risk
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                  Instant settlement marketplace
                </li>
              </ul>
              <Button variant="ghost" className="w-full mt-4 group-hover:bg-accent/10">
                Start Trading →
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover-lift cursor-pointer" onClick={() => navigate("/dashboard")}>
            <CardHeader>
              <div className="w-16 h-16 bg-blockchain/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blockchain/20 transition-colors">
                <Globe className="w-8 h-8 text-blockchain animate-pulse-slow" />
              </div>
              <CardTitle className="text-xl">Regulator Dashboard</CardTitle>
              <CardDescription>
                APIs and dashboards for compliance reporting, ESG verification, and regulatory oversight
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blockchain rounded-full mr-3" />
                  RESTful compliance APIs
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blockchain rounded-full mr-3" />
                  Live global project mapping
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blockchain rounded-full mr-3" />
                  Encrypted audit certificates
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blockchain rounded-full mr-3" />
                  ESG report integration tools
                </li>
              </ul>
              <Button variant="ghost" className="w-full mt-4 group-hover:bg-blockchain/10">
                Access Dashboard →
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Interactive Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30" style={{ background: 'var(--gradient-card)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
            <p className="text-muted-foreground">Real-time data from our blockchain network</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 animate-pulse-slow">$2.4B</div>
                <div className="text-sm text-muted-foreground">Green H2 Market</div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div className="bg-primary h-2 rounded-full w-[85%] animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-success mb-2 animate-pulse-slow">847</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div className="bg-success h-2 rounded-full w-[92%] animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2 animate-pulse-slow">99.9%</div>
                <div className="text-sm text-muted-foreground">Fraud Prevention</div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div className="bg-accent h-2 rounded-full w-[99%] animate-pulse" />
                </div>
              </CardContent>
            </Card>
            <Card className="text-center hover-lift">
              <CardContent className="p-6">
                <div className="text-4xl md:text-5xl font-bold text-blockchain mb-2 animate-pulse-slow">24/7</div>
                <div className="text-sm text-muted-foreground">Real-time Trading</div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div className="bg-blockchain h-2 rounded-full w-[100%] animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Green Hydrogen Trading?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the revolution in transparent, blockchain-verified hydrogen credit trading.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => navigate("/auth")}>
              <Zap className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => navigate("/dashboard")}>
              <Users className="w-5 h-5 mr-2" />
              Request Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
