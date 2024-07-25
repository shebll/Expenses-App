import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Logout = () => {
  return (
    <Button variant="secondary" size="sm" className="p-[0.7rem]">
      <LogOut size={14} />
    </Button>
  );
};

export default Logout;
