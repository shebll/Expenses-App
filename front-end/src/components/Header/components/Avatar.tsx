import { Button } from "@/components/ui/button";
import { userQueryOption } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { LogIn, LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Profile from "@/components/pages/Profile";
const Avatar = () => {
  const { data, isPending } = useQuery(userQueryOption);
  console.log(data);
  if (isPending)
    return (
      <div className="w-[38px] h-[36px] rounded-lg animate-pulse bg-secondary"></div>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {data ? (
          <img
            src={data.user.picture || "/default-avatar.png"}
            alt="User Avatar"
            className="object-cover w-12 h-12 rounded-full cursor-pointer"
          />
        ) : (
          <Button variant="secondary" size="sm" className="p-[0.7rem]">
            <User size={16} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Profile />
        {data ? (
          <Button variant={"destructive"} className="w-full">
            <a href="/api/logout" className="flex justify-between flex-1 gap-1">
              <p>Logout</p> <LogOut />
            </a>
          </Button>
        ) : (
          <DropdownMenuItem>
            <a href="/api/login" className="flex justify-between gap-1">
              <p>LogIn</p> <LogIn />
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Avatar;
