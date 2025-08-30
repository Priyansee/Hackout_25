import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { blockchain } from "@/lib/blockchain";
import { Wallet, User, Shield } from "lucide-react";
import type { User as UserType } from "@/types";

export function WalletConnect() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectWalletMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest("POST", "/api/auth/connect-wallet", {
        walletAddress,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setConnectedWallet(data.user.walletAddress);
      setUser(data.user);
      
      if (data.isNewUser) {
        setIsVerifying(true);
        toast({
          title: "Wallet Connected",
          description: "Please complete DID verification to access all features.",
        });
      } else {
        toast({
          title: "Welcome Back",
          description: `Connected as ${data.user.name || data.user.walletAddress}`,
        });
        setIsOpen(false);
      }
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const verifyDIDMutation = useMutation({
    mutationFn: async (data: {
      userId: string;
      did: string;
      name: string;
      organization: string;
      location: string;
      role: string;
    }) => {
      const response = await apiRequest("POST", "/api/auth/verify-did", data);
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      setIsVerifying(false);
      setIsOpen(false);
      toast({
        title: "Verification Complete",
        description: "Your DID has been verified successfully.",
      });
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Failed to verify DID. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleConnectWallet = async () => {
    try {
      const walletAddress = await blockchain.connectWallet();
      connectWalletMutation.mutate(walletAddress);
    } catch (error) {
      toast({
        title: "Wallet Error",
        description: "Failed to connect to wallet.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyDID = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    verifyDIDMutation.mutate({
      userId: user.id,
      did: formData.get("did") as string,
      name: formData.get("name") as string,
      organization: formData.get("organization") as string,
      location: formData.get("location") as string,
      role: formData.get("role") as string,
    });
  };

  if (connectedWallet && user?.verificationStatus) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
          <div className="flex items-center space-x-1">
            {user.role === "regulator" && <Shield className="h-4 w-4 text-primary" />}
            {user.role === "producer" && <User className="h-4 w-4 text-secondary" />}
            {(user.role === "buyer" || user.role === "investor") && <Wallet className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm font-medium">
              {user.name || `${connectedWallet.slice(0, 6)}...${connectedWallet.slice(-4)}`}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-muted hover:bg-accent text-foreground" data-testid="button-connect-wallet">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isVerifying ? "Complete DID Verification" : "Connect Your Wallet"}
          </DialogTitle>
        </DialogHeader>

        {!isVerifying ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your wallet to access the HydroChain platform and manage your hydrogen credits.
            </p>
            <Button
              onClick={handleConnectWallet}
              disabled={connectWalletMutation.isPending}
              className="w-full glow-effect"
              data-testid="button-wallet-connect"
            >
              {connectWalletMutation.isPending ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleVerifyDID} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Complete your profile to access all platform features.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="did">DID (Decentralized Identifier)</Label>
              <Input
                id="did"
                name="did"
                placeholder="did:ethr:0x..."
                defaultValue={`did:ethr:${connectedWallet}`}
                required
                data-testid="input-did"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
                required
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                name="organization"
                placeholder="Your organization"
                required
                data-testid="input-organization"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="City, Country"
                required
                data-testid="input-location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" required>
                <SelectTrigger data-testid="select-role">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="producer">Hydrogen Producer</SelectItem>
                  <SelectItem value="buyer">Hydrogen Buyer</SelectItem>
                  <SelectItem value="investor">Investor</SelectItem>
                  <SelectItem value="regulator">Regulator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={verifyDIDMutation.isPending}
              className="w-full glow-effect"
              data-testid="button-verify-did"
            >
              {verifyDIDMutation.isPending ? "Verifying..." : "Complete Verification"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
