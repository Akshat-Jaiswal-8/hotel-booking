import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router";
import { apiCaller } from "@/lib/api-caller.ts";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { useTransition } from "react";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(16, {
      message: "Password must not exceed 16 characters.",
    }),
});

export type LoginFormValues = z.infer<typeof formSchema>;

export const Login = () => {
  const { setUser } = useAuthStore((state) => state);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit: SubmitHandler<LoginFormValues> = (
    values: LoginFormValues,
  ) => {
    startTransition(async () => {
      try {
        const email = values.email;
        const password = values.password;
        const { data } = await apiCaller.post("auth/login", {
          email,
          password,
        });

        const user = data.user;
        if (user) {
          setUser(user);
          const token = data.token;
          Cookies.set("token", token, { expires: 7 });
          const userFirstName = user?.name.split(" ")[0];
          toast.success("Login successful", {
            description: `Logged in as ${userFirstName}`,
          });
          form.reset();
          navigate("/");
        } else {
          toast.error("Login failed", {
            description: "Please check your credentials and try again",
          });
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error("Login failed", {
            description: error.response?.data.message,
          });
        } else {
          toast.error("Login failed", {
            description: "Please check your credentials and try again",
          });
        }
      }
    });
  };

  return (
    <section
      className={
        "container flex items-center h-full min-h-[var(--height-screen)] w-full"
      }
    >
      <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in rounded-xl overflow-hidden">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription>
            Enter your credentials to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 animate-slide-up"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        autoComplete="email"
                        {...field}
                        className="h-11 px-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="*********"
                        {...field}
                        className="h-11 px-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full h-11 transition-all duration-200 hover:bg-blue-800 hover:shadow-md"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader className={"animate-spin size-5"} />
                ) : (
                  <span className={"text-white"}>Sign In</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-sm text-muted-foreground mt-2 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary underline-offset-4 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};
