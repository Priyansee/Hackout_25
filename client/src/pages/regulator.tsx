import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Upload,
  Map,
  List,
  BarChart3,
  Shield,
  Globe,
  Activity
} from "lucide-react";
import type { ComplianceStats, Transaction, Project } from "@/types";

function RegulatorDashboard() {
  // Define alerts that was missing
  const alerts = [
    {
      title: "High Volume Transaction",
      description: "Transaction exceeds daily limit",
      color: "border-destructive/20 bg-destructive/5",
      icon: AlertTriangle
    },
    {
      title: "Pending Verification", 
      description: "2 documents require review",
      color: "border-yellow-500/20 bg-yellow-500/5",
      icon: Clock
    }
  ];

  const [mapView, setMapView] = useState<"map" | "list">("map");
  const [alertList, setAlertList] = useState(alerts);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 5;
  const navigate = useNavigate();

  const { data: complianceStats, isLoading: isStatsLoading } = useQuery<ComplianceStats>({
    queryKey: ["/api/regulator/compliance"],
  });

  const { data: projects = [], isLoading: isProjectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: creditFlows } = useQuery({
    queryKey: ["/api/regulator/credit-flows"],
  });

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

  const documents = [
    {
      name: "GreenH2-Cert-001.pdf",
      hash: "0x7b2a9c...4f8e1d",
      verified: true,
    },
    {
      name: "Nordic-Audit-2024.pdf", 
      hash: "0x9f3b8a...2e6c7d",
      verified: true,
    },
  ];

  if (isStatsLoading) {
    return (
      <div className="min-h-screen bg-muted/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Regulator Dashboard</h1>
          <p className="text-xl text-muted-foreground">Real-time compliance monitoring and analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Live Map */}
            <Card data-testid="regulator-map-section">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Global Hydrogen Projects
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={mapView === "map" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapView("map")}
                      data-testid="button-map-view"
                    >
                      <Map className="mr-1 h-4 w-4" />
                      Map View
                    </Button>
                    <Button
                      variant={mapView === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapView("list")}
                      data-testid="button-list-view"
                    >
                      <List className="mr-1 h-4 w-4" />
                      List View
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {mapView === "map" ? (
                  <div className="h-80 bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                      alt="World map showing hydrogen production locations"
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-primary mb-2">
                          <Globe className="h-12 w-12 mx-auto" />
                        </div>
                        <div className="text-lg font-semibold">Interactive Map</div>
                        <div className="text-sm text-muted-foreground">
                          {projects.length} Active Projects Worldwide
                        </div>
                      </div>
                    </div>
                    {/* Map markers */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-secondary rounded-full animate-pulse" />
                    <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary rounded-full animate-pulse" />
                    <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-secondary rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {isProjectsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))
                    ) : (
                      <>
                        {projects
                          .slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)
                          .map((project) => (
                            <div key={project.id} className="flex justify-between items-center p-3 border border-border rounded-lg">
                              <div>
                                <div className="font-medium">{project.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {project.location.name} • {project.capacity} • {project.technology}
                                </div>
                              </div>
                              <div className="flex gap-2 items-center">
                                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                                  {project.status}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  data-testid="button-view-project"
                                  onClick={() => navigate(`/projects/${project.id}`)}
                                >
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={currentPage === 1}
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                              data-testid="button-prev-projects"
                            >
                              Previous
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={currentPage * projectsPerPage >= projects.length}
                              onClick={() => setCurrentPage((p) => p + 1)}
                              data-testid="button-next-projects"
                            >
                              Next
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="default"
                            data-testid="button-view-all-projects"
                            onClick={() => setCurrentPage(1)}
                          >
                            View All Projects
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="chart-container" data-testid="credit-flows-chart">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Credit Flows (Monthly)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => (
                      <div key={month} className="flex flex-col items-center">
                        <div 
                          className={`w-8 rounded-t transition-all duration-300 ${
                            index % 2 === 0 ? "bg-primary" : "bg-secondary"
                          }`} 
                          style={{ height: `${60 + (index * 10)}%` }}
                        />
                        <div className="text-xs text-muted-foreground mt-2">{month}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="chart-container" data-testid="retirement-rates-chart">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Retirement Rates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path 
                          className="text-muted stroke-current" 
                          strokeWidth="3" 
                          fill="none" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path 
                          className="text-secondary stroke-current" 
                          strokeWidth="3" 
                          fill="none" 
                          strokeLinecap="round"
                          strokeDasharray="75, 100" 
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-secondary">75%</div>
                          <div className="text-xs text-muted-foreground">Retired</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Table */}
            <Card data-testid="compliance-events-table">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Compliance Events</CardTitle>
                  <Button className="bg-primary hover:bg-primary/90" data-testid="button-export-report">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 font-medium">Timestamp</th>
                        <th className="text-left py-3 font-medium">Event Type</th>
                        <th className="text-left py-3 font-medium">Producer</th>
                        <th className="text-left py-3 font-medium">Amount</th>
                        <th className="text-left py-3 font-medium">Status</th>
                        <th className="text-left py-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complianceStats?.recentTransactions?.slice(0, 10).map((tx) => (
                        <tr key={tx.id} className="border-b border-border/50">
                          <td className="py-3 text-sm">
                            {new Date(tx.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <Badge className={getTransactionTypeColor(tx.transactionType)}>
                              {tx.transactionType.charAt(0).toUpperCase() + tx.transactionType.slice(1)}
                            </Badge>
                          </td>
                          <td className="py-3">
                            {tx.from.slice(0, 8)}...{tx.from.slice(-4)}
                          </td>
                          <td className="py-3">
                            {tx.amount ? `${tx.amount.toLocaleString()} kg H₂` : "-"}
                          </td>
                          <td className="py-3">
                            <Badge className="bg-secondary/20 text-secondary">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" data-testid="button-verify-event">Verify</Button>
                              <Button size="sm" variant="destructive" data-testid="button-flag-event">Flag</Button>
                            </div>
                          </td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground">
                            No recent transactions available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card data-testid="quick-stats">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Projects</span>
                    <span className="font-semibold text-xl">
                      {complianceStats?.activeProjects || projects.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Credits</span>
                    <span className="font-semibold text-xl text-secondary">
                      {complianceStats?.activeCredits || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Retired Credits</span>
                    <span className="font-semibold text-xl text-destructive">
                      {complianceStats?.retiredCredits || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Volume</span>
                    <span className="font-semibold text-xl">
                      {complianceStats?.totalVolume 
                        ? `${(complianceStats.totalVolume / 1000000).toFixed(1)}M kg H₂`
                        : "0 kg H₂"
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card data-testid="compliance-alerts">
              <CardHeader>
                <CardTitle>Compliance Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertList.map((alert, index) => (
                    <div key={index} className={`border rounded-lg p-3 ${alert.color} relative`}>
                      <button
                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                        aria-label="Dismiss alert"
                        data-testid={`button-dismiss-alert-${index}`}
                        onClick={() => setAlertList((prev) => prev.filter((_, i) => i !== index))}
                        type="button"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                      <div className="flex items-start gap-2">
                        <alert.icon className="h-4 w-4 mt-1" />
                        <div>
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs opacity-80">{alert.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Verification */}
            <Card data-testid="document-verification">
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="border border-border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{doc.name}</span>
                        <div className="flex gap-2 items-center">
                          {doc.verified && (
                            <span className="text-secondary text-xs">
                              <Shield className="h-3 w-3" />
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            data-testid={`button-download-document-${index}`}
                            onClick={() => {
                              // Simulate download (replace with real logic as needed)
                              const link = document.createElement('a');
                              link.href = `/api/documents/download/${doc.name}`;
                              link.download = doc.name;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        Hash: {doc.hash}
                      </div>
                    </div>
                  ))}
                  <input
                    type="file"
                    id="upload-doc-input"
                    className="hidden"
                    onChange={(e) => {
                      // Placeholder for upload logic
                      if (e.target.files && e.target.files.length > 0) {
                        // handle file upload here
                        alert(`Selected file: ${e.target.files[0].name}`);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    className="w-full border-dashed hover:border-primary/50 hover:text-primary"
                    data-testid="button-upload-document"
                    onClick={() => document.getElementById('upload-doc-input')?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document for Verification
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegulatorDashboard;