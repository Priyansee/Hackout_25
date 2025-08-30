// client/src/pages/marketplace.tsx
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
import type { Credit } from "@/types";
import { Link } from "react-router-dom";

export default function Marketplace() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("price-low");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [certificationFilters, setCertificationFilters] = useState<string[]>([]);
  const [selectedCredit, setSelectedCredit] = useState<Credit | null>(null);
  const [isBuyDialogOpen, setIsBuyDialogOpen] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // ✅ Marketplace listings
  const { data: listings = [], isLoading } = useQuery<Credit[]>({
    queryKey: ["/marketplace"],
  });

  // ✅ Portfolio
  const { data: portfolio } = useQuery({
    queryKey: ["/credits"],
  });

  // ✅ Buy mutation → maps to POST /transactions
  const buyMutation = useMutation({
    mutationFn: async (data: { listingId: string; quantity: number }) => {
      const response = await apiRequest("POST", "/transactions", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Purchase Successful", description: "Credit has been transferred." });
      setIsBuyDialogOpen(false);
      setSelectedCredit(null);
      queryClient.invalidateQueries({ queryKey: ["/marketplace"] });
      queryClient.invalidateQueries({ queryKey: ["/credits"] });
    },
    onError: () => {
      toast({
        title: "Purchase Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredListings = listings.filter(listing => {
    const price = listing.pricePerCredit;
    const minPrice = priceMin ? parseFloat(priceMin) : 0;
    const maxPrice = priceMax ? parseFloat(priceMax) : Infinity;
    if (price < minPrice || price > maxPrice) return false;
    if (certificationFilters.length > 0) {
      if (!certificationFilters.includes(listing.certification)) return false;
    }
    return true;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "price-low": return a.pricePerCredit - b.pricePerCredit;
      case "price-high": return b.pricePerCredit - a.pricePerCredit;
      case "recent": return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      default: return 0;
    }
  });

  const handleBuy = (credit: Credit) => {
    setSelectedCredit(credit);
    setIsBuyDialogOpen(true);
  };

  const confirmPurchase = () => {
    if (!selectedCredit) return;
    buyMutation.mutate({
      listingId: selectedCredit._id!,
      quantity: selectedCredit.quantity,
    });
  };

  if (isLoading) {
    return <div className="text-center py-20">Loading marketplace...</div>;
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Hydrogen Credit Marketplace</h1>
          <p className="text-xl text-muted-foreground">Trade verified credits securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Filters</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Price Range (ETH)</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
                    <Input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Certification</Label>
                  {["CertifHy Green", "Green-e Certified", "EU RES Directive"].map(cert => (
                    <div key={cert} className="flex items-center gap-2">
                      <Checkbox
                        id={cert}
                        checked={certificationFilters.includes(cert)}
                        onCheckedChange={() =>
                          setCertificationFilters(prev =>
                            prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
                          )
                        }
                      />
                      <Label htmlFor={cert}>{cert}</Label>
                    </div>
                  ))}
                </div>
                <Button onClick={() => { setPriceMin(""); setPriceMax(""); setCertificationFilters([]); }}>Clear</Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <span>Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="recent">Recently Listed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")}><Grid3x3 /></Button>
                <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")}><List /></Button>
              </div>
            </div>

            {/* Results */}
            {sortedListings.length === 0 ? (
              <div className="text-center py-20">No credits available</div>
            ) : (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                {sortedListings.map((credit) => (
                  <TradingCard key={credit._id} credit={credit} onBuy={handleBuy} onViewDetails={setSelectedCredit} />
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
                      {/* ✅ Link to new page */}
                      <Link to="/list-credits">
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-2" /> List Credit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" /> Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* ... portfolio summary as you had ... */}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Buy Confirmation Dialog */}
        <Dialog open={isBuyDialogOpen} onOpenChange={setIsBuyDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Confirm Purchase</DialogTitle></DialogHeader>
            {selectedCredit && (
              <div className="space-y-4">
                <p><strong>Project:</strong> {selectedCredit.projectName}</p>
                <p><strong>Quantity:</strong> {selectedCredit.quantity} credits</p>
                <p><strong>Total:</strong> {(selectedCredit.quantity * selectedCredit.pricePerCredit).toFixed(2)} ETH</p>
                <div className="flex gap-2">
                  <Button onClick={confirmPurchase} disabled={buyMutation.isPending}>
                    {buyMutation.isPending ? "Processing..." : "Confirm"}
                  </Button>
                  <Button variant="outline" onClick={() => setIsBuyDialogOpen(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
