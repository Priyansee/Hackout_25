import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { TradingCard } from "@/components/trading-card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Grid3x3, List, Download, Plus, Edit, X } from "lucide-react";
import type { HydrogenCredit } from "@/types";

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("price-low");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [amountFilter, setAmountFilter] = useState("any");
  const [certificationFilters, setCertificationFilters] = useState<string[]>([]);
  const [selectedCredit, setSelectedCredit] = useState<HydrogenCredit | null>(null);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: listings = [], isLoading } = useQuery<HydrogenCredit[]>({
    queryKey: ["/api/marketplace/listings"],
  });

  const { data: portfolio } = useQuery({
    queryKey: ["/api/users/0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9/portfolio"],
  });

  const buyMutation = useMutation({
    mutationFn: async (data: { tokenId: string; buyer: string; seller: string; price: string }) => {
      const response = await apiRequest("POST", "/api/marketplace/trade", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Purchase Successful",
        description: "Credit has been transferred to your wallet.",
      });
      setIsBuyDialogOpen(false);
      setSelectedCredit(null);
      queryClient.invalidateQueries({ queryKey: ["/api/marketplace/listings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description: "Failed to complete the transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredListings = listings.filter(listing => {
    if (!listing.pricePerKg) return false;
    
    const price = parseFloat(listing.pricePerKg);
    const minPrice = priceMin ? parseFloat(priceMin) : 0;
    const maxPrice = priceMax ? parseFloat(priceMax) : Infinity;
    
    if (price < minPrice || price > maxPrice) return false;
    
    if (amountFilter !== "any") {
      const amount = listing.amount;
      switch (amountFilter) {
        case "100-500":
          if (amount < 100 || amount > 500) return false;
          break;
        case "500-1000":
          if (amount < 500 || amount > 1000) return false;
          break;
        case "1000+":
          if (amount < 1000) return false;
          break;
      }
    }
    
    if (certificationFilters.length > 0) {
      const hasMatchingCert = certificationFilters.some(cert => 
        listing.certificationLevel.toLowerCase().includes(cert.toLowerCase())
      );
      if (!hasMatchingCert) return false;
    }
    
    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.pricePerKg || "0") - parseFloat(b.pricePerKg || "0");
      case "price-high":
        return parseFloat(b.pricePerKg || "0") - parseFloat(a.pricePerKg || "0");
      case "amount-high":
        return b.amount - a.amount;
      case "recent":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleBuy = (credit: HydrogenCredit) => {
    setSelectedCredit(credit);
    setIsBuyDialogOpen(true);
  };

  const confirmPurchase = () => {
    if (!selectedCredit) return;
    
    const totalPrice = (parseFloat(selectedCredit.pricePerKg || "0") * selectedCredit.amount / 100).toString();
    
    buyMutation.mutate({
      tokenId: selectedCredit.tokenId,
      buyer: "0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9", // Mock buyer wallet
      seller: selectedCredit.currentOwner,
      price: totalPrice,
    });
  };

  const toggleCertificationFilter = (cert: string) => {
    setCertificationFilters(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert)
        : [...prev, cert]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse text-2xl">Loading marketplace...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Hydrogen Credit Marketplace</h1>
          <p className="text-xl text-muted-foreground">Trade verified green hydrogen credits securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Price Range (ETH)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="text-sm"
                      data-testid="input-price-min"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="text-sm"
                      data-testid="input-price-max"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Amount (kg H₂)</Label>
                  <Select value={amountFilter} onValueChange={setAmountFilter}>
                    <SelectTrigger className="text-sm" data-testid="select-amount-filter">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Amount</SelectItem>
                      <SelectItem value="100-500">100-500 kg</SelectItem>
                      <SelectItem value="500-1000">500-1000 kg</SelectItem>
                      <SelectItem value="1000+">1000+ kg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Certification</Label>
                  <div className="space-y-2">
                    {["CertifHy Green", "Green-e Certified", "EU RES Directive"].map(cert => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={certificationFilters.includes(cert)}
                          onCheckedChange={() => toggleCertificationFilter(cert)}
                          data-testid={`checkbox-${cert.toLowerCase().replace(/\s+/g, '-')}`}
                        />
                        <Label htmlFor={cert} className="text-sm">{cert}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    setPriceMin("");
                    setPriceMax("");
                    setAmountFilter("any");
                    setCertificationFilters([]);
                  }}
                  className="w-full" 
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48" data-testid="select-sort-by">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="amount-high">Amount: High to Low</SelectItem>
                    <SelectItem value="recent">Recently Listed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-grid-view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  data-testid="button-list-view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Results */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground">
                Showing {sortedListings.length} credits available for trading
              </span>
            </div>

            {/* Trading Grid */}
            {sortedListings.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold mb-2">No credits available</h3>
                <p className="text-muted-foreground">Try adjusting your filters to see more listings</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {sortedListings.map((credit) => (
                  <TradingCard
                    key={credit.id}
                    credit={credit}
                    onBuy={handleBuy}
                    onViewDetails={(credit) => setSelectedCredit(credit)}
                  />
                ))}
              </div>
            )}

            {/* Portfolio Section */}
            {portfolio && (
              <Card className="mt-12">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Portfolio</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid="button-list-credit">
                        <Plus className="h-4 w-4 mr-2" />
                        List Credit
                      </Button>
                      <Button variant="outline" size="sm" data-testid="button-export-portfolio">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{portfolio.credits?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Credits Owned</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-secondary">
                        {portfolio.credits?.reduce((sum: number, c: any) => sum + c.amount, 0).toLocaleString() || 0} kg
                      </div>
                      <div className="text-sm text-muted-foreground">Total H₂ Amount</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {((portfolio.credits?.reduce((sum: number, c: any) => sum + parseFloat(c.pricePerKg || "0") * c.amount / 100, 0) || 0)).toFixed(2)} ETH
                      </div>
                      <div className="text-sm text-muted-foreground">Portfolio Value</div>
                    </div>
                  </div>
                  
                  {portfolio.credits?.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 font-medium">Token ID</th>
                            <th className="text-left py-3 font-medium">Producer</th>
                            <th className="text-left py-3 font-medium">Amount</th>
                            <th className="text-left py-3 font-medium">Status</th>
                            <th className="text-left py-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.credits.slice(0, 5).map((credit: any) => (
                            <tr key={credit.id} className="border-b border-border/50">
                              <td className="py-3 font-mono text-sm">{credit.tokenId}</td>
                              <td className="py-3">{credit.producer}</td>
                              <td className="py-3">{credit.amount.toLocaleString()} kg H₂</td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  credit.status === "active" ? "bg-secondary/20 text-secondary" : 
                                  credit.status === "traded" ? "bg-primary/20 text-primary" : 
                                  "bg-muted text-muted-foreground"
                                }`}>
                                  {credit.status.charAt(0).toUpperCase() + credit.status.slice(1)}
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm" data-testid={`button-edit-${credit.tokenId}`}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" data-testid={`button-remove-${credit.tokenId}`}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Buy Confirmation Dialog */}
        <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Purchase</DialogTitle>
            </DialogHeader>
            
            {selectedCredit && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{selectedCredit.tokenId}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Producer:</span>
                      <span>{selectedCredit.producer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span>{selectedCredit.amount.toLocaleString()} kg H₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per 100kg:</span>
                      <span>{selectedCredit.pricePerKg} ETH</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total Price:</span>
                      <span>{((parseFloat(selectedCredit.pricePerKg || "0") * selectedCredit.amount) / 100).toFixed(2)} ETH</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={confirmPurchase}
                    disabled={buyMutation.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    data-testid="button-confirm-purchase"
                  >
                    {buyMutation.isPending ? "Processing..." : "Confirm Purchase"}
                  </Button>
                  <Button
                    onClick={() => setIsBuyDialogOpen(false)}
                    variant="outline"
                    className="flex-1"
                    data-testid="button-cancel-purchase"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
