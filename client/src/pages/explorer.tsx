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

// Simulated current user (replace with JWT user info)
const currentUser = {
  username: "alice",
  role: "Producer", // "Producer" | "Trader" | "Regulator" | "ESG Investor"
};

// ✅ Backend API
async function fetchCredits(): Promise<HydrogenCredit[]> {
  const res = await fetch("http://localhost:5000/api/credits");
  if (!res.ok) throw new Error("Failed to fetch credits");
  return res.json();
}

export default function Explorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedCredit, setSelectedCredit] = useState<HydrogenCredit | null>(null);
  const [creditTransactions, setCreditTransactions] = useState<Transaction[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);

  const { data: credits = [], isLoading, error, refetch } = useQuery<HydrogenCredit[]>({
    queryKey: ["credits"],
    queryFn: fetchCredits,
    refetchInterval: 10000,
  });

  const filteredCredits = credits.filter((credit) => {
    const matchesSearch =
      credit.tokenId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      credit.producer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || credit.status === statusFilter;
    const matchesLocation =
      locationFilter === "all" || credit.projectLocation.name.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const handleViewDetails = async (credit: HydrogenCredit) => {
    try {
      const response = await fetch(`http://localhost:5000/api/credits/${credit.tokenId}`);
      const data = await response.json();
      setSelectedCredit(data.credit);
      setCreditTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch credit details:", error);
      setSelectedCredit(credit);
      setCreditTransactions([]);
    }
  };

  const handleAction = async (type: string, credit: HydrogenCredit) => {
    setLoadingAction(true);
    try {
      let endpoint = "";
      if (type === "mint") endpoint = "/api/credits/mint";
      if (type === "transfer") endpoint = "/api/credits/transfer";
      if (type === "verify") endpoint = "/api/credits/verify";
      if (type === "retire") endpoint = "/api/credits/retire";

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creditId: credit.tokenId, user: currentUser.username }),
      });

      if (!res.ok) throw new Error("Action failed");
      await refetch(); // refresh data after action
      alert(`${type} successful!`);
    } catch (err) {
      alert(`Failed to ${type}: ${(err as Error).message}`);
    } finally {
      setLoadingAction(false);
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

  if (error) {
    return (
      <div className="min-h-screen bg-muted/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-500">
          Failed to load credits. <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Hydrogen Digital Passport Explorer</h1>
          <p className="text-xl text-muted-foreground">
            Discover, trade, verify, and retire green hydrogen credits with transparency
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by token ID or producer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Norway">Norway</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
              <SelectItem value="Netherlands">Netherlands</SelectItem>
            </SelectContent>
          </Select>
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
              <CreditCard key={credit.id} credit={credit} onViewDetails={handleViewDetails} />
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
                {/* Left: Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Production Details</h4>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Producer:</span>
                        <span>{selectedCredit.producer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span>{selectedCredit.amount.toLocaleString()} kg H₂</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Production Date:</span>
                        <span>{new Date(selectedCredit.productionDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{selectedCredit.projectLocation.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Technology:</span>
                        <span>{selectedCredit.productionMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carbon Intensity:</span>
                        <span>{selectedCredit.carbonIntensity} kg CO₂/kg H₂</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Certification</h4>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={selectedCredit.status === "active" ? "default" : "secondary"}>
                          {selectedCredit.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verified:</span>
                        <span>{selectedCredit.isVerified ? "Yes" : "Pending"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Owner:</span>
                        <span className="font-mono text-sm">
                          {selectedCredit.currentOwner.slice(0, 8)}...{selectedCredit.currentOwner.slice(-4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Transactions + Actions */}
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
                          {tx.price && <div className="text-sm text-muted-foreground">Price: {tx.price} ETH</div>}
                          {tx.amount && <div className="text-sm text-muted-foreground">Amount: {tx.amount.toLocaleString()} kg H₂</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Role-Based Action Buttons */}
                  <div className="mt-6 space-x-3">
                    {currentUser.role === "Producer" && (
                      <Button onClick={() => handleAction("mint", selectedCredit)} disabled={loadingAction}>
                        Mint More
                      </Button>
                    )}
                    {currentUser.role === "Trader" && (
                      <Button onClick={() => handleAction("transfer", selectedCredit)} disabled={loadingAction}>
                        Trade
                      </Button>
                    )}
                    {currentUser.role === "Regulator" && (
                      <Button onClick={() => handleAction("verify", selectedCredit)} disabled={loadingAction}>
                        Verify
                      </Button>
                    )}
                    {currentUser.role === "ESG Investor" && (
                      <Button onClick={() => handleAction("retire", selectedCredit)} disabled={loadingAction}>
                        Retire
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}