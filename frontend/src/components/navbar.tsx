import React from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Link } from "react-router";

export const Navbar = (): React.JSX.Element => {
  const { user, logout } = useAuthStore((state) => state);

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
            className={
              "text-xl font-semibold text-slate-900 dark:text-slate-300"
            }
          >
            Reserve Go
          </p>
        </Link>
        <div className={"flex items-center gap-x-6"}>
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
              <Avatar>
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
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
    </nav>
  );
};
