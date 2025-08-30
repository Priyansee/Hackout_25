import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  User, 
  Wallet, 
  Shield, 
  Settings, 
  Bell, 
  Key, 
  Download,
  Edit,
  CheckCircle,
  AlertCircle,
  Activity,
  TrendingUp
} from "lucide-react";
import type { User as UserType, HydrogenCredit, Transaction } from "@/types";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    mobile: true,
    trading: true,
    compliance: true,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock user data - in real app this would come from authentication context
  const mockUser: UserType = {
    id: "user-1",
    walletAddress: "0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9",
    did: "did:ethr:0x742d35Cc6554C19c3a5Cc2A1d4e9e7b8f1a2e8f9",
    role: "producer",
    verificationStatus: true,
    name: "Sarah Chen",
    organization: "GreenH2 Industries",
    location: "California, USA",
    createdAt: new Date("2024-01-01"),
  };

  const { data: portfolio } = useQuery({
    queryKey: ["/api/users", mockUser.walletAddress, "portfolio"],
  });

  const { data: userTransactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/users", mockUser.walletAddress, "transactions"],
    queryFn: async () => {
      // Mock transaction data
      return [
        {
          id: "tx-1",
          from: "0x0000000000000000000000000000000000000000",
          to: mockUser.walletAddress,
          tokenId: "H2-GEN-001",
          transactionHash: "0x742d35cc6554c19c3a5cc2a1d4e9e7b8f1a2e8f9",
          transactionType: "mint" as const,
          price: "0.00",
          timestamp: new Date("2024-01-15T10:30:00Z"),
        },
        {
          id: "tx-2",
          from: mockUser.walletAddress,
          to: "0x456def789abc123456789def0123456789abcdef",
          tokenId: "H2-GEN-001",
          transactionHash: "0x8f1a2e9c742d35cc6554c19c3a5cc2a1d4e9e7b8",
          transactionType: "trade" as const,
          amount: 500,
          price: "25.00",
          timestamp: new Date("2024-01-18T14:20:00Z"),
        },
      ];
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserType>) => {
      const response = await apiRequest("PUT", `/api/users/${mockUser.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProfileSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    updateProfileMutation.mutate({
      name: formData.get("name") as string,
      organization: formData.get("organization") as string,
      location: formData.get("location") as string,
      role: formData.get("role") as UserType["role"],
    });
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "producer":
        return <User className="h-4 w-4" />;
      case "regulator":
        return <Shield className="h-4 w-4" />;
      case "buyer":
      case "investor":
        return <Wallet className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "producer":
        return "bg-secondary/20 text-secondary";
      case "regulator":
        return "bg-primary/20 text-primary";
      case "buyer":
      case "investor":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
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

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Profile & Settings</h1>
          <p className="text-xl text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" data-testid="tab-profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="portfolio" data-testid="tab-portfolio">
              <TrendingUp className="h-4 w-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-2">
                <Card data-testid="profile-information">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Profile Information</CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        data-testid="button-edit-profile"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={mockUser.name}
                            required
                            data-testid="input-edit-name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <Input
                            id="organization"
                            name="organization"
                            defaultValue={mockUser.organization}
                            required
                            data-testid="input-edit-organization"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            defaultValue={mockUser.location}
                            required
                            data-testid="input-edit-location"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select name="role" defaultValue={mockUser.role}>
                            <SelectTrigger data-testid="select-edit-role">
                              <SelectValue />
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
                          disabled={updateProfileMutation.isPending}
                          className="w-full"
                          data-testid="button-save-profile"
                        >
                          {updateProfileMutation.isPending ? "Updating..." : "Save Changes"}
                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-muted-foreground">Full Name</Label>
                          <div className="font-medium">{mockUser.name}</div>
                        </div>
                        
                        <div>
                          <Label className="text-muted-foreground">Organization</Label>
                          <div className="font-medium">{mockUser.organization}</div>
                        </div>
                        
                        <div>
                          <Label className="text-muted-foreground">Location</Label>
                          <div className="font-medium">{mockUser.location}</div>
                        </div>
                        
                        <div>
                          <Label className="text-muted-foreground">Role</Label>
                          <div className="flex items-center gap-2">
                            <Badge className={getRoleColor(mockUser.role)}>
                              {getRoleIcon(mockUser.role)}
                              {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-muted-foreground">Member Since</Label>
                          <div className="font-medium">
                            {new Date(mockUser.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Identity Verification */}
              <div>
                <Card data-testid="identity-verification">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Identity Verification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">DID Status</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-secondary" />
                        <span className="text-secondary font-medium">Verified</span>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">Wallet Address</Label>
                      <div className="font-mono text-sm break-all">
                        {mockUser.walletAddress}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-muted-foreground">DID</Label>
                      <div className="font-mono text-sm break-all">
                        {mockUser.did}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Verified</span>
                        <CheckCircle className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">KYC Completed</span>
                        <CheckCircle className="h-4 w-4 text-secondary" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">2FA Enabled</span>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" data-testid="button-security-settings">
                      <Key className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card data-testid="portfolio-summary">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {portfolio?.credits?.length || 0}
                  </div>
                  <div className="text-muted-foreground">Credits Owned</div>
                </CardContent>
              </Card>
              
              <Card data-testid="portfolio-volume">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-secondary mb-2">
                    {portfolio?.credits?.reduce((sum: number, c: any) => sum + c.amount, 0).toLocaleString() || 0} kg
                  </div>
                  <div className="text-muted-foreground">Total H₂ Amount</div>
                </CardContent>
              </Card>
              
              <Card data-testid="portfolio-value">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {((portfolio?.credits?.reduce((sum: number, c: any) => sum + parseFloat(c.pricePerKg || "0") * c.amount / 100, 0) || 0)).toFixed(2)} ETH
                  </div>
                  <div className="text-muted-foreground">Portfolio Value</div>
                </CardContent>
              </Card>
            </div>

            <Card data-testid="portfolio-credits">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Your Credits</CardTitle>
                  <Button variant="outline" data-testid="button-export-portfolio">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {portfolio?.credits?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 font-medium">Token ID</th>
                          <th className="text-left py-3 font-medium">Amount</th>
                          <th className="text-left py-3 font-medium">Status</th>
                          <th className="text-left py-3 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolio.credits.map((credit: any) => (
                          <tr key={credit.id} className="border-b border-border/50">
                            <td className="py-3 font-mono text-sm">{credit.tokenId}</td>
                            <td className="py-3">{credit.amount.toLocaleString()} kg H₂</td>
                            <td className="py-3">
                              <Badge className={getRoleColor(credit.status)}>
                                {credit.status.charAt(0).toUpperCase() + credit.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 font-semibold">
                              {credit.pricePerKg 
                                ? `${(parseFloat(credit.pricePerKg) * credit.amount / 100).toFixed(2)} ETH`
                                : "Not Listed"
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">No credits in your portfolio</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card data-testid="transaction-history">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {userTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {userTransactions.map((tx) => (
                      <div key={tx.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getTransactionTypeColor(tx.transactionType)}>
                                {tx.transactionType.charAt(0).toUpperCase() + tx.transactionType.slice(1)}
                              </Badge>
                              <span className="font-mono text-sm">{tx.tokenId}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Hash: {tx.transactionHash.slice(0, 20)}...
                            </div>
                            {tx.price && (
                              <div className="text-sm">
                                <span className="text-muted-foreground">Price: </span>
                                <span className="font-semibold">{tx.price} ETH</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">No transaction history available</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card data-testid="notification-settings">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium capitalize">
                        {key === "email" ? "Email Notifications" :
                         key === "browser" ? "Browser Notifications" :
                         key === "mobile" ? "Mobile Push Notifications" :
                         key === "trading" ? "Trading Alerts" :
                         "Compliance Updates"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {key === "email" ? "Receive updates via email" :
                         key === "browser" ? "Show browser notifications" :
                         key === "mobile" ? "Push notifications to mobile" :
                         key === "trading" ? "Alerts for trading activity" :
                         "Regulatory compliance notifications"}
                      </div>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [key]: checked }))
                      }
                      data-testid={`switch-${key}-notifications`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card data-testid="account-settings">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" data-testid="button-change-password">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-export-data">
                  <Download className="h-4 w-4 mr-2" />
                  Export Account Data
                </Button>
                <Separator />
                <Button variant="destructive" className="w-full" data-testid="button-delete-account">
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
