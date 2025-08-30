import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, ShoppingCart } from "lucide-react";
import type { HydrogenCredit } from "@/types";

interface TradingCardProps {
  credit: HydrogenCredit;
  onBuy?: (credit: HydrogenCredit) => void;
  onViewDetails?: (credit: HydrogenCredit) => void;
}

export function TradingCard({ credit, onBuy, onViewDetails }: TradingCardProps) {
  const getCertificationColor = (level: string) => {
    switch (level) {
      case "Premium Green":
        return "bg-secondary/20 text-secondary";
      case "Standard Green":
        return "bg-primary/20 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getEnergySourceImage = (energySource: string) => {
    if (energySource.toLowerCase().includes("solar")) {
      return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
    } else if (energySource.toLowerCase().includes("wind")) {
      return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
    } else if (energySource.toLowerCase().includes("hydro")) {
      return "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
    }
    return "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200";
  };

  const totalPrice = credit.pricePerKg 
    ? (parseFloat(credit.pricePerKg) * credit.amount / 100).toFixed(2)
    : "0.00";

  return (
    <Card className="nft-card bg-card border border-border overflow-hidden" data-testid={`trading-card-${credit.tokenId}`}>
      <img
        src={getEnergySourceImage(credit.energySource)}
        alt={`${credit.energySource} hydrogen facility`}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold" data-testid={`trading-title-${credit.tokenId}`}>
              {credit.tokenId}
            </h3>
            <p className="text-sm text-muted-foreground">{credit.producer}</p>
          </div>
          <Badge className={`${getCertificationColor(credit.certificationLevel)} text-xs`}>
            {credit.certificationLevel === "Premium Green" ? "Premium" : "Standard"}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount:</span>
            <span>{credit.amount.toLocaleString()} kg H₂</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Price per 100kg:</span>
            <span className="font-semibold text-primary">
              {credit.pricePerKg ? `${credit.pricePerKg} ETH` : "Not Listed"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-semibold">{totalPrice} ETH</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Carbon Intensity:</span>
            <span className="text-secondary">{credit.carbonIntensity} kg CO₂/kg H₂</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onBuy?.(credit)}
            disabled={!credit.pricePerKg || parseFloat(credit.pricePerKg) === 0}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
            data-testid={`button-buy-${credit.tokenId}`}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Buy Now
          </Button>
          <Button
            onClick={() => onViewDetails?.(credit)}
            variant="outline"
            size="sm"
            className="px-3"
            data-testid={`button-view-details-${credit.tokenId}`}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
