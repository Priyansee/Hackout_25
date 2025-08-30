// client/src/pages/list-credits.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useNavigate } from "react-router-dom";

export default function ListCredits() {
  const { data: portfolio } = useQuery({ queryKey: ["/credits"] });
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [creditId, setCreditId] = useState("");
  const [pricePerCredit, setPricePerCredit] = useState("");
  const [quantity, setQuantity] = useState("");

  const listMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/marketplace/list/${creditId}`, {
        pricePerCredit: parseFloat(pricePerCredit),
        quantity: parseInt(quantity),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Credit listed!", description: "Your credit is now on the marketplace." });
      queryClient.invalidateQueries({ queryKey: ["/marketplace"] });
      navigate("/marketplace");
    },
    onError: () => {
      toast({ title: "Failed", description: "Could not list credit.", variant: "destructive" });
    },
  });

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-xl mx-auto px-4">
        <Card>
          <CardHeader><CardTitle>List Your Credit</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Select Credit</label>
              <Select value={creditId} onValueChange={setCreditId}>
                <SelectTrigger><SelectValue placeholder="Choose credit" /></SelectTrigger>
                <SelectContent>
                  {portfolio?.map((c: any) => (
                    <SelectItem key={c._id} value={c._id}>{c.projectName} ({c.quantity} avail)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Price per Credit (ETH)</label>
              <Input type="number" value={pricePerCredit} onChange={(e) => setPricePerCredit(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Quantity</label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <Button onClick={() => listMutation.mutate()} disabled={listMutation.isPending} className="w-full">
              {listMutation.isPending ? "Listing..." : "List Credit"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
