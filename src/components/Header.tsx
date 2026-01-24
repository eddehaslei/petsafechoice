import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-10">
      <div className="container max-w-4xl mx-auto px-4 py-4 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-accent">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer">
              About
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Safe Foods List
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Emergency Contacts
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              FAQ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
