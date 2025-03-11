import React from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Link } from "react-router";
import { useMediaQuery } from "@uidotdev/usehooks";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { cn } from "@/lib/utils.ts";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const navItems = [
  {
    name: "Hotels",
    path: "/hotels",
  },
  {
    name: "Bookings",
    path: "/bookings",
  },
];

export const Navbar = (): React.JSX.Element => {
  const { user, logout } = useAuthStore((state) => state);

  const isSmallDevice = useMediaQuery("only screen and (max-width : 700px)");

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  return (
    <nav className={"max-h-[10vh] border-b border-dotted border-blue-800 p-4"}>
      <div className={"container flex items-center justify-between"}>
        <Link to={"/"} className={"flex items-center gap-x-4"}>
          <img
            className={
              "rounded-full p-0.5 hover:shadow-xl hover:shadow-gray-100"
            }
            src={"/logo.webp"}
            alt={"mind sparks logo"}
            height={40}
            width={40}
          />
          <p
            className={cn(
              "text-xl md:block hidden font-semibold text-slate-900 dark:text-slate-300",
            )}
          >
            Reserve Go
          </p>
        </Link>
        {isSmallDevice ? (
          <>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-lg font-medium text-slate-900 dark:text-slate-300 hover:text-blue-700 transition-all duration-300"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {!user ? (
                    <Link to={"/login"}>
                      <Button
                        className={
                          "w-full bg-blue-700 hover:bg-blue-900 dark:text-white"
                        }
                      >
                        Login
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-x-2">
                        <Avatar>
                          <AvatarFallback>
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p>Hello {user.name}!</p>
                      </div>
                      <Button
                        onClick={handleLogout}
                        className={
                          "bg-blue-700 hover:bg-blue-900 dark:text-white"
                        }
                      >
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <div>
            <div className={"flex items-center gap-x-6"}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={
                    "text-lg font-medium text-slate-900 dark:text-slate-300 hover:text-blue-700 transition-all duration-300"
                  }
                >
                  {item.name}
                </Link>
              ))}
              {!user ? (
                <Link to={"/login"}>
                  <Button
                    className={"bg-blue-700 hover:bg-blue-900 dark:text-white"}
                  >
                    Login
                  </Button>
                </Link>
              ) : (
                <div className={"flex items-center gap-x-4"}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar>
                          <AvatarFallback>
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Hello {user.name}!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <Button
                    onClick={handleLogout}
                    className={"bg-blue-700 hover:bg-blue-900 dark:text-white"}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
