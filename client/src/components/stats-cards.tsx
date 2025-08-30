import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
  totalCreditsIssued: number;
  activeProjects: number;
  verificationRate: number;
  tradingVolume: number;
}

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card border border-border">
            <CardContent className="p-6 text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <Card className="bg-card border border-border">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-destructive mb-2">Error</div>
            <div className="text-muted-foreground">Failed to load stats</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <Card className="bg-card border border-border" data-testid="stats-total-credits">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {stats.totalCreditsIssued.toLocaleString()}
          </div>
          <div className="text-muted-foreground">Total Credits Issued</div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border border-border" data-testid="stats-active-projects">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">
            {stats.activeProjects}
          </div>
          <div className="text-muted-foreground">Active Projects</div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border border-border" data-testid="stats-verification-rate">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">
            {stats.verificationRate}%
          </div>
          <div className="text-muted-foreground">Verification Rate</div>
        </CardContent>
      </Card>
      
      <Card className="bg-card border border-border" data-testid="stats-trading-volume">
        <CardContent className="p-6 text-center">
          <div className="text-3xl font-bold text-secondary mb-2">
            ${(stats.tradingVolume / 1000000).toFixed(1)}M
          </div>
          <div className="text-muted-foreground">Trading Volume</div>
        </CardContent>
      </Card>
    </div>
  );
}
