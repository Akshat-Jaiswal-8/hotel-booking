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
import { useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { Loader } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Name must not exceed 50 characters.",
    }),
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

export type RegisterFormValues = z.infer<typeof formSchema>;

export const Register = () => {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit: SubmitHandler<RegisterFormValues> = (
    values: RegisterFormValues,
  ) => {
    startTransition(async () => {
      try {
        const name = values.name;
        const email = values.email;
        const password = values.password;

        const { data } = await apiCaller.post("auth/register", {
          name,
          email,
          password,
        });

        if (data) {
          toast.success("Signed up successfully.");
        } else {
          toast.error("Registration failed", {
            description: "Please check your credentials and try again",
          });
        }
        navigate("/login");
      } catch (error: AxiosError | any) {
        if (error instanceof AxiosError) {
          toast.error("Registration failed", {
            description: error.response?.data,
          });
        } else {
          console.error(error);
          toast.error("Registration failed", {
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
            Welcome to Reserve Go
          </CardTitle>
          <CardDescription>
            Enter your credentials to sign up for an account
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
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
                        placeholder="********"
                        type="password"
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
                  <span className={"text-white"}>Sign Up</span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="text-sm text-muted-foreground mt-2 text-center">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};
