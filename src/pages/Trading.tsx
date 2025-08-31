import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TrendingUp, TrendingDown, Zap, Shield, Globe, Clock, DollarSign, Filter, Wallet, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Trading = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filter, setFilter] = useState("all");
  const [wallet, setWallet] = useState({ balance: 45.2, credits: 12 });
  
  // Simulate real-time price updates
  const [priceUpdates, setPriceUpdates] = useState({});
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceUpdates(prev => ({
        ...prev,
        timestamp: Date.now()
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const mockCredits = [
    {
      id: "HC-001",
      producer: "GreenTech Energy",
      location: "California, USA",
      amount: "50.5 tCO2e",
      price: 85.50,
      priceChange: +2.1,
      verified: true,
      blockchainHash: "0x1a2b3c4d5e6f7890",
      certification: "Gold Standard",
      rating: 4.8,
      minOrder: 10,
      available: 45.5
    },
    {
      id: "HC-002", 
      producer: "Nordic H2",
      location: "Norway",
      amount: "125.0 tCO2e",
      price: 92.00,
      priceChange: -1.3,
      verified: true,
      blockchainHash: "0x9f8e7d6c5b4a3210",
      certification: "VCS",
      rating: 4.9,
      minOrder: 25,
      available: 108.0
    },
    {
      id: "HC-003",
      producer: "Solar Hydrogen Co",
      location: "Australia",
      amount: "75.2 tCO2e", 
      price: 88.25,
      priceChange: +0.8,
      verified: true,
      blockchainHash: "0x5a6b7c8d9e0f1234",
      certification: "CDM",
      rating: 4.6,
      minOrder: 15,
      available: 62.0
    },
    {
      id: "HC-004",
      producer: "WindPower H2",
      location: "Denmark",
      amount: "95.8 tCO2e",
      price: 89.75,
      priceChange: +3.2,
      verified: true,
      blockchainHash: "0xa1b2c3d4e5f67890",
      certification: "Gold Standard",
      rating: 4.7,
      minOrder: 20,
      available: 78.3
    }
  ];

  const handleBuyCredit = (credit) => {
    toast({
      title: "Trade Initiated",
      description: `Purchasing ${credit.id} for $${credit.price} via smart contract.`,
    });
    // Simulate blockchain transaction
    setTimeout(() => {
      toast({
        title: "Trade Successful",
        description: `${credit.id} purchased and added to your wallet.`,
      });
      setWallet(prev => ({ 
        balance: prev.balance - credit.price, 
        credits: prev.credits + 1 
      }));
    }, 2000);
  };

  const handleQuickTrade = () => {
    if (!tradeAmount || !maxPrice) {
      toast({
        title: "Missing Information",
        description: "Please enter both amount and max price.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Quick Trade Executed",
      description: `Market order for ${tradeAmount} tCO2e at max $${maxPrice}.`,
    });
    setTradeAmount("");
    setMaxPrice("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Fraud-Proof Credit Exchange</h1>
                <p className="text-sm text-muted-foreground">Real-time NFT-based trading</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Card className="p-3">
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Wallet className="w-4 h-4 mr-1 text-primary" />
                    <span>${wallet.balance.toFixed(2)}</span>
                  </div>
                  <div className="text-muted-foreground">|</div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-accent" />
                    <span>{wallet.credits} Credits</span>
                  </div>
                </div>
              </Card>
              <Badge variant="secondary" className="bg-blockchain text-blockchain-foreground animate-pulse">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Secured
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trading Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Market Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Volume 24H</p>
                      <p className="text-2xl font-bold text-primary animate-pulse-slow">$2.4M</p>
                      <p className="text-xs text-success">+12.5%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-success animate-pulse" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Credits</p>
                      <p className="text-2xl font-bold text-primary animate-pulse-slow">847</p>
                      <p className="text-xs text-accent">Live</p>
                    </div>
                    <Zap className="w-8 h-8 text-accent animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Price</p>
                      <p className="text-2xl font-bold text-primary animate-pulse-slow">$89.42</p>
                      <p className="text-xs text-success">+3.2%</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-blockchain animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Verified</p>
                      <p className="text-2xl font-bold text-success animate-pulse-slow">99.9%</p>
                      <p className="text-xs text-success">Fraud-proof</p>
                    </div>
                    <Shield className="w-8 h-8 text-success animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <div className="flex space-x-2">
                      <Button 
                        variant={filter === "all" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilter("all")}
                      >
                        All Credits
                      </Button>
                      <Button 
                        variant={filter === "gold" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilter("gold")}
                      >
                        Gold Standard
                      </Button>
                      <Button 
                        variant={filter === "vcs" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setFilter("vcs")}
                      >
                        VCS
                      </Button>
                    </div>
                  </div>
                  <Badge className="bg-success text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    Live Prices
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Available Credits */}
            <Card>
              <CardHeader>
                <CardTitle>Available Green Hydrogen Credits</CardTitle>
                <CardDescription>
                  All credits are NFT-based and blockchain-verified with real-time pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCredits.map((credit) => (
                    <Card
                      key={credit.id}
                      className="hover-lift cursor-pointer transition-all border-l-4"
                      style={{ borderLeftColor: credit.priceChange > 0 ? 'hsl(var(--success))' : 'hsl(var(--error))' }}
                      onClick={() => setSelectedCredit(credit)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <Badge variant="outline" className="font-mono text-xs">
                                {credit.id}
                              </Badge>
                              <Badge className="bg-success text-white">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                              <Badge variant="secondary">{credit.certification}</Badge>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                <span className="text-xs">{credit.rating}</span>
                              </div>
                            </div>
                            <h3 className="font-semibold text-lg">{credit.producer}</h3>
                            <p className="text-sm text-muted-foreground flex items-center mt-1">
                              <Globe className="w-3 h-3 mr-1" />
                              {credit.location}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                              <div>
                                <span className="text-muted-foreground">Available:</span>
                                <span className="ml-1 font-medium">{credit.available} tCO2e</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Min Order:</span>
                                <span className="ml-1 font-medium">{credit.minOrder} tCO2e</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground font-mono mt-2">
                              Hash: {credit.blockchainHash}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end mb-1">
                              <div className="text-2xl font-bold text-primary">${credit.price}</div>
                              <div className={`ml-2 text-sm flex items-center ${
                                credit.priceChange > 0 ? 'text-success' : 'text-error'
                              }`}>
                                {credit.priceChange > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                {credit.priceChange > 0 ? '+' : ''}{credit.priceChange}%
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">per tCO2e</p>
                            <Button 
                              size="sm" 
                              className="w-full hover-lift"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBuyCredit(credit);
                              }}
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Sidebar */}
          <div className="space-y-6">
            {/* Quick Trade */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Trade</CardTitle>
                <CardDescription>
                  Instant purchase with smart contract execution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Amount (tCO2e)</label>
                  <Input 
                    type="number" 
                    placeholder="Enter amount"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Max Price ($)</label>
                  <Input 
                    type="number" 
                    placeholder="Enter max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
                <Button className="w-full hover-lift" onClick={handleQuickTrade}>
                  <Zap className="w-4 h-4 mr-2" />
                  Execute Trade
                </Button>
                <p className="text-xs text-muted-foreground">
                  Trade executed via smart contract with instant settlement
                </p>
                {tradeAmount && maxPrice && (
                  <div className="bg-muted/50 rounded p-3 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated Cost:</span>
                      <span className="font-medium">${(parseFloat(tradeAmount) * parseFloat(maxPrice)).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blockchain Status */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blockchain" />
                  Blockchain Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm">Network</span>
                  <Badge className="bg-success text-white animate-pulse">
                    <div className="w-2 h-2 bg-white rounded-full mr-2" />
                    Ethereum
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Gas Price</span>
                  <span className="text-sm font-medium text-blockchain">25 Gwei</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Block Time</span>
                  <span className="text-sm font-medium text-success">12.5s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Block</span>
                  <span className="text-sm font-medium font-mono">#18,945,231</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">Network Health:</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div className="bg-success h-2 rounded-full w-[98%] animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-primary" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-success" />
                        <span className="text-success font-medium">Buy HC-001</span>
                      </div>
                      <p className="text-xs text-muted-foreground">2 min ago</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">$85.50</div>
                      <div className="text-xs text-muted-foreground">25.5 tCO2e</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-success" />
                        <span className="text-success font-medium">Buy HC-003</span>
                      </div>
                      <p className="text-xs text-muted-foreground">5 min ago</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">$88.25</div>
                      <div className="text-xs text-muted-foreground">15.0 tCO2e</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                    <div className="text-sm">
                      <div className="flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1 text-error" />
                        <span className="text-error font-medium">Sell HC-007</span>
                      </div>
                      <p className="text-xs text-muted-foreground">12 min ago</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">$91.00</div>
                      <div className="text-xs text-muted-foreground">30.0 tCO2e</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;