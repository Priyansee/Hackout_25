import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "@/components/credit-card";
import { Search, Filter } from "lucide-react";
import type { HydrogenCredit, Transaction } from "@/types";

export default function Explorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedCredit, setSelectedCredit] = useState<HydrogenCredit | null>(null);
  const [creditTransactions, setCreditTransactions] = useState<Transaction[]>([]);

  const { data: credits = [], isLoading } = useQuery<HydrogenCredit[]>({
    queryKey: ["/api/credits"],
  });

  const filteredCredits = credits.filter(credit => {
    const matchesSearch = 
      credit.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.producer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || credit.status === statusFilter;
    const matchesLocation = locationFilter === "all" || credit.projectLocation.name.includes(locationFilter);
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleViewDetails = async (credit: HydrogenCredit) => {
    try {
      const response = await fetch(`/api/credits/${credit.tokenId}`);
      const data = await response.json();
      setSelectedCredit(data.credit);
      setCreditTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch credit details:", error);
      setSelectedCredit(credit);
      setCreditTransactions([]);
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "mint":
        return "bg-secondary/20 text-secondary";
      case "trade":
        return "bg-primary/20 text-primary";
      case "retire":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse text-2xl">Loading credits...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Hydrogen Digital Passport Explorer</h1>
          <p className="text-xl text-muted-foreground">Discover and verify green hydrogen credits with complete transparency</p>
        </div>

        {/* Search Interface */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by Token ID, Project Name, or Producer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-credits"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40" data-testid="select-status-filter">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="traded">Traded</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-48" data-testid="select-location-filter">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="California">California, USA</SelectItem>
                  <SelectItem value="Norway">Oslo, Norway</SelectItem>
                  <SelectItem value="Germany">Bavaria, Germany</SelectItem>
                  <SelectItem value="Sweden">Stockholm, Sweden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Showing {filteredCredits.length} of {credits.length} credits
            </span>
            <Button variant="outline" size="sm" data-testid="button-advanced-filters">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Credit Grid */}
        {filteredCredits.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold mb-2">No credits found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCredits.map((credit) => (
              <CreditCard
                key={credit.id}
                credit={credit}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Credit Details Dialog */}
        <Dialog open={!!selectedCredit} onOpenChange={() => setSelectedCredit(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Credit Details: {selectedCredit?.tokenId}</DialogTitle>
            </DialogHeader>
            
            {selectedCredit && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Certification Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Producer:</span>
                      <span>{selectedCredit.producer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Technology:</span>
                      <span>{selectedCredit.technology}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Energy Source:</span>
                      <span className="text-secondary">{selectedCredit.energySource}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certification:</span>
                      <span>{selectedCredit.certificationLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Carbon Intensity:</span>
                      <span className="text-secondary">{selectedCredit.carbonIntensity} kg CO₂/kg H₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span>{selectedCredit.amount.toLocaleString()} kg H₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issuance Date:</span>
                      <span>{new Date(selectedCredit.issuanceDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span>{selectedCredit.projectLocation.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Certification Hash:</span>
                      <span className="font-mono text-xs">
                        {selectedCredit.certificationHash.slice(0, 20)}...
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Transaction History</h4>
                  {creditTransactions.length === 0 ? (
                    <p className="text-muted-foreground">No transactions found</p>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {creditTransactions.map((tx) => (
                        <div key={tx.id} className="border border-border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <Badge className={getTransactionTypeColor(tx.transactionType)}>
                              {tx.transactionType.charAt(0).toUpperCase() + tx.transactionType.slice(1)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            TxHash: {tx.transactionHash.slice(0, 20)}...
                          </div>
                          {tx.price && (
                            <div className="text-sm text-muted-foreground">
                              Price: {tx.price} ETH
                            </div>
                          )}
                          {tx.amount && (
                            <div className="text-sm text-muted-foreground">
                              Amount: {tx.amount.toLocaleString()} kg H₂
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
