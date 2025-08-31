import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, Globe, FileText, Download, Eye, MapPin, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const mockComplianceData = [
    {
      jurisdiction: "European Union",
      requirements: "REPowerEU Hydrogen Standards",
      status: "Compliant",
      lastAudit: "2024-01-15",
      nextDeadline: "2024-06-15",
      projects: 45
    },
    {
      jurisdiction: "United States",
      requirements: "IRA Clean Hydrogen Standards",
      status: "Compliant", 
      lastAudit: "2024-01-10",
      nextDeadline: "2024-07-01",
      projects: 23
    },
    {
      jurisdiction: "Japan",
      requirements: "METI Green Hydrogen Certification",
      status: "Review Required",
      lastAudit: "2023-12-20",
      nextDeadline: "2024-03-30",
      projects: 12
    }
  ];

  const mockProjectData = [
    {
      id: "P001",
      name: "GreenTech Solar H2 Plant",
      location: "California, USA",
      capacity: "50 MW",
      status: "Operational",
      monthlyProduction: "125 tCO2e",
      coordinates: { lat: 34.0522, lng: -118.2437 }
    },
    {
      id: "P002", 
      name: "Nordic Wind Hydrogen",
      location: "Norway",
      capacity: "75 MW",
      status: "Operational",
      monthlyProduction: "180 tCO2e",
      coordinates: { lat: 59.9139, lng: 10.7522 }
    },
    {
      id: "P003",
      name: "Solar H2 Australia",
      location: "Queensland, Australia", 
      capacity: "100 MW",
      status: "Under Construction",
      monthlyProduction: "0 tCO2e",
      coordinates: { lat: -27.4698, lng: 153.0251 }
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold">Regulator & ESG Dashboard</h1>
            </div>
            <Badge variant="secondary" className="bg-blockchain text-blockchain-foreground">
              <FileText className="w-3 h-3 mr-1" />
              API Enabled
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-3xl font-bold text-primary">80</p>
                </div>
                <BarChart3 className="w-10 h-10 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jurisdictions</p>
                  <p className="text-3xl font-bold text-accent">18</p>
                </div>
                <Globe className="w-10 h-10 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Rate</p>
                  <p className="text-3xl font-bold text-success">94.2%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Calls/Day</p>
                  <p className="text-3xl font-bold text-blockchain">2.4K</p>
                </div>
                <FileText className="w-10 h-10 text-blockchain" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compliance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="compliance">Compliance Monitoring</TabsTrigger>
            <TabsTrigger value="projects">Project Mapping</TabsTrigger>
            <TabsTrigger value="reports">ESG Reports</TabsTrigger>
            <TabsTrigger value="api">API Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status by Jurisdiction</CardTitle>
                <CardDescription>
                  Real-time compliance monitoring across all regulatory frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockComplianceData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{item.jurisdiction}</h3>
                        <Badge className={
                          item.status === 'Compliant' 
                            ? 'bg-success text-white' 
                            : 'bg-warning text-black'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{item.requirements}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Projects:</span>
                          <span className="ml-2 font-medium">{item.projects}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Audit:</span>
                          <span className="ml-2 font-medium">{item.lastAudit}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Deadline:</span>
                          <span className="ml-2 font-medium">{item.nextDeadline}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Project Mapping</CardTitle>
                <CardDescription>
                  Interactive map showing all verified green hydrogen projects worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mock Map Placeholder */}
                <div className="bg-muted/30 rounded-lg h-96 flex items-center justify-center mb-6">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive Global Project Map</p>
                    <p className="text-sm text-muted-foreground">Real-time project locations and status</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockProjectData.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{project.id}</Badge>
                          <h3 className="font-semibold">{project.name}</h3>
                        </div>
                        <Badge className={
                          project.status === 'Operational' 
                            ? 'bg-success text-white' 
                            : 'bg-warning text-black'
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <p className="font-medium">{project.location}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Capacity:</span>
                          <p className="font-medium">{project.capacity}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly Production:</span>
                          <p className="font-medium text-primary">{project.monthlyProduction}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ESG Compliance Reports</CardTitle>
                <CardDescription>
                  Generate and download compliance reports for ESG integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Available Reports</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Q1 2024 Compliance Report</h4>
                          <p className="text-sm text-muted-foreground">Complete ESG compliance overview</p>
                        </div>
                        <Button size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Carbon Credit Analysis</h4>
                          <p className="text-sm text-muted-foreground">Detailed credit verification report</p>
                        </div>
                        <Button size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Project Impact Assessment</h4>
                          <p className="text-sm text-muted-foreground">Environmental impact metrics</p>
                        </div>
                        <Button size="sm">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Custom Report Generator</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Report Type</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>ESG Compliance</option>
                          <option>Carbon Credit Verification</option>
                          <option>Project Performance</option>
                          <option>Regulatory Compliance</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time Period</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>Last 30 Days</option>
                          <option>Last Quarter</option>
                          <option>Last Year</option>
                          <option>Custom Range</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Jurisdiction</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>All Jurisdictions</option>
                          <option>European Union</option>
                          <option>United States</option>
                          <option>Japan</option>
                        </select>
                      </div>
                      <Button className="w-full">
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RESTful Compliance APIs</CardTitle>
                <CardDescription>
                  Integrate compliance data directly into your systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">API Endpoints</h3>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge className="bg-success text-white">GET</Badge>
                            <code className="text-sm">/api/v1/projects</code>
                          </div>
                          <p className="text-xs text-muted-foreground">Retrieve all verified projects</p>
                        </div>
                        <div className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className="bg-success text-white">GET</Badge>
                          <code className="text-sm">/api/v1/credits/&#123;id&#125;</code>
                        </div>
                        <p className="text-xs text-muted-foreground">Get specific credit details</p>
                      </div>
                      <div className="border rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className="bg-success text-white">GET</Badge>
                          <code className="text-sm">/api/v1/compliance/&#123;jurisdiction&#125;</code>
                        </div>
                          <p className="text-xs text-muted-foreground">Compliance status by region</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Authentication</h3>
                      <div className="space-y-3">
                        <div className="border rounded-lg p-3">
                          <h4 className="font-medium text-sm mb-2">API Key</h4>
                          <code className="text-xs bg-muted p-2 rounded block">
                            Authorization: Bearer your_api_key
                          </code>
                        </div>
                        <div className="border rounded-lg p-3">
                          <h4 className="font-medium text-sm mb-2">Rate Limiting</h4>
                          <p className="text-xs text-muted-foreground">1000 requests per hour</p>
                        </div>
                        <div className="border rounded-lg p-3">
                          <h4 className="font-medium text-sm mb-2">Response Format</h4>
                          <p className="text-xs text-muted-foreground">JSON with encrypted certificates</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Example Response</h3>
                    <div className="bg-muted/30 rounded-lg p-4">
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
{`{
  "project_id": "P001",
  "name": "GreenTech Solar H2 Plant",
  "location": "California, USA",
  "capacity": "50 MW",
  "status": "operational",
  "credits_issued": 125,
  "blockchain_hash": "0x1a2b3c4d5e6f7890",
  "compliance": {
    "eu_standards": "compliant",
    "us_ira": "compliant",
    "last_audit": "2024-01-15"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;