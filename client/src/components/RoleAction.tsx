import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface RoleActionsProps {
  creditId: string;
  status: string;
}

export default function RoleActions({ creditId, status }: RoleActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={() => navigate(`/list-credits?creditId=${creditId}`)}
        data-testid="button-list-credit"
      >
        List
      </Button>
      <Button size="sm" variant="outline" data-testid="button-edit-credit">
        Edit
      </Button>
      <Button size="sm" variant="destructive" data-testid="button-remove-credit">
        Remove
      </Button>
    </div>
  );
}
