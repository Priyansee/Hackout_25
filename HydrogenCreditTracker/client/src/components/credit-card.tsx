import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Factory } from "lucide-react";
import type { HydrogenCredit } from "@/types";

interface CreditCardProps {
  credit: HydrogenCredit;
  onViewDetails?: (credit: HydrogenCredit) => void;
}

export function CreditCard({ credit, onViewDetails }: CreditCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-secondary/20 text-secondary";
      case "traded":
        return "bg-primary/20 text-primary";
      case "retired":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEnergySourceImage = (energySource: string) => {
    if (energySource.toLowerCase().includes("solar")) {
      return "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
    } else if (energySource.toLowerCase().includes("wind")) {
      return "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
    } else if (energySource.toLowerCase().includes("hydro")) {
      return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
    }
    return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
  };

  return (
    <Card className="nft-card bg-card border border-border overflow-hidden" data-testid={`credit-card-${credit.tokenId}`}>
      <img
        src={getEnergySourceImage(credit.energySource)}
        alt={`${credit.energySource} hydrogen production facility`}
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1" data-testid={`credit-title-${credit.tokenId}`}>
              {credit.tokenId}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <Factory className="h-3 w-3 mr-1" />
              {credit.producer}
            </p>
          </div>
          <Badge className={`${getStatusColor(credit.status)} text-xs font-medium`}>
            {credit.status.charAt(0).toUpperCase() + credit.status.slice(1)}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-medium">{credit.amount.toLocaleString()} kg H₂</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Issued:</span>
            <span className="font-medium flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(credit.issuanceDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Location:</span>
            <span className="font-medium flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {credit.projectLocation.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Energy:</span>
            <span className="font-medium text-secondary">{credit.energySource}</span>
          </div>
        </div>
        
        <Button
          onClick={() => onViewDetails?.(credit)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          data-testid={`button-view-passport-${credit.tokenId}`}
        >
          View Passport
        </Button>
      </CardContent>
    </Card>
  );
}
