import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { toast } from "sonner";

const AuthMiddleware = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore((state) => state);

  useEffect(() => {
    if (!user) {
      toast.info("Please login to continue!");
      navigate("/");
    }
  }, [user, navigate]);

  return user ? <>{children}</> : null;
};

export default AuthMiddleware;
