import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Shield, MapPin, Calendar, Zap, ExternalLink, CheckCircle, Clock, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Explorer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPassport, setSelectedPassport] = useState(null);
  const [filter, setFilter] = useState("all");

  const mockPassports = [
    {
      id: "HC-001",
      producer: "GreenTech Energy",
      location: "California, USA",
      coordinates: "34.0522°N, 118.2437°W",
      productionDate: "2024-01-15",
      amount: "50.5 tCO2e",
      status: "Active",
      blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890",
      smartContract: "0x742d35cc6e9e0532c9fe",
      certification: "Gold Standard",
      verificationSteps: [
        { step: "Production Verified", timestamp: "2024-01-15 09:30", status: "completed" },
        { step: "Blockchain Minted", timestamp: "2024-01-15 10:15", status: "completed" },
        { step: "Third-party Audit", timestamp: "2024-01-16 14:20", status: "completed" },
        { step: "Market Listed", timestamp: "2024-01-17 08:45", status: "completed" }
      ]
    },
    {
      id: "HC-002",
      producer: "Nordic H2",
      location: "Norway",
      coordinates: "59.9139°N, 10.7522°E",
      productionDate: "2024-01-20",
      amount: "125.0 tCO2e",
      status: "Active",
      blockchainHash: "0x9f8e7d6c5b4a3210fedcba0987654321",
      smartContract: "0x853f46dd8c5e1d73d7ac",
      certification: "VCS",
      verificationSteps: [
        { step: "Production Verified", timestamp: "2024-01-20 11:15", status: "completed" },
        { step: "Blockchain Minted", timestamp: "2024-01-20 12:00", status: "completed" },
        { step: "Third-party Audit", timestamp: "2024-01-21 16:30", status: "completed" },
        { step: "Market Listed", timestamp: "2024-01-22 09:10", status: "completed" }
      ]
    }
  ];

  const filteredPassports = mockPassports.filter(passport =>
    passport.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passport.producer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    passport.blockchainHash.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold">Hydrogen Digital Passport Explorer</h1>
                <p className="text-sm text-muted-foreground">Complete lifecycle traceability</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blockchain text-blockchain-foreground animate-pulse">
              <Shield className="w-3 h-3 mr-1" />
              Blockchain Verified
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by ID, producer, or blockchain hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={filter === "active" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("active")}
              >
                Active
              </Button>
              <Button 
                variant={filter === "completed" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("completed")}
              >
                Verified
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-3xl font-bold text-primary animate-pulse-slow">847</p>
                  <p className="text-xs text-success">+23 today</p>
                </div>
                <Zap className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Verified Producers</p>
                  <p className="text-3xl font-bold text-success animate-pulse-slow">156</p>
                  <p className="text-xs text-success">100% verified</p>
                </div>
                <Shield className="w-10 h-10 text-success animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Countries</p>
                  <p className="text-3xl font-bold text-accent animate-pulse-slow">42</p>
                  <p className="text-xs text-accent">Global reach</p>
                </div>
                <MapPin className="w-10 h-10 text-accent animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Block Height</p>
                  <p className="text-3xl font-bold text-blockchain animate-pulse-slow">18.9M</p>
                  <p className="text-xs text-blockchain">Live sync</p>
                </div>
                <ExternalLink className="w-10 h-10 text-blockchain animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Digital Passports */}
        <div className="space-y-6">
          {filteredPassports.map((passport) => (
            <Card key={passport.id} className="overflow-hidden hover-lift">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <span>Digital Passport: {passport.id}</span>
                      <Badge className="bg-success text-white animate-pulse">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Complete lifecycle tracking and blockchain verification
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Downloading Certificate",
                          description: `Digital certificate for ${passport.id} downloaded.`,
                        });
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Certificate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Opening Etherscan",
                          description: `Viewing ${passport.id} on blockchain explorer.`,
                        });
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on Etherscan
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Production Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Producer:</span>
                        <span className="font-medium">{passport.producer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{passport.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coordinates:</span>
                        <span className="font-medium font-mono text-sm">{passport.coordinates}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Production Date:</span>
                        <span className="font-medium">{passport.productionDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium text-primary">{passport.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certification:</span>
                        <Badge variant="secondary">{passport.certification}</Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-2">Blockchain Information</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-muted-foreground text-sm">Contract Address:</span>
                          <p className="font-mono text-sm text-blockchain break-all">{passport.smartContract}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground text-sm">Transaction Hash:</span>
                          <p className="font-mono text-sm text-blockchain break-all">{passport.blockchainHash}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Verification Timeline</h3>
                    <div className="space-y-4">
                      {passport.verificationSteps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3 hover:bg-muted/30 rounded p-2 transition-colors">
                          <div className="flex-shrink-0">
                            <div className={`w-4 h-4 rounded-full mt-1 flex items-center justify-center ${
                              step.status === 'completed' ? 'bg-success' : 'bg-muted'
                            }`}>
                              {step.status === 'completed' && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                              {step.status !== 'completed' && (
                                <Clock className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{step.step}</p>
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {step.timestamp}
                            </p>
                          </div>
                          <Badge className={`${
                            step.status === 'completed' 
                              ? 'bg-success text-white animate-pulse' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {step.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => setSelectedPassport(passport)}
                    >
                      View Full Timeline
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPassports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No digital passports found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Explorer;