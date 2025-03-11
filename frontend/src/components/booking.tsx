import { useEffect, useState, useTransition } from "react";
import { apiCaller } from "@/lib/api-caller.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Loader, TriangleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  aadhaar: z
    .string()
    .length(12, {
      message: "Aadhaar number must be exactly 12 digits.",
    })
    .regex(/^\d+$/, {
      message: "Aadhaar must contain only numbers.",
    }),
});

export type AadhaarFormSchema = z.infer<typeof formSchema>;

// here I have used a hook, because in future if many bookings are there then we can add pagination to it, so that a few bookings are fetched at a time, thus reducing the load on the server.

const useHotelDetails = (hotelId: string) => {
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) return;

      setLoading(true);
      setError(null);

      try {
        const { data: response } = await apiCaller.get(`/hotel/${hotelId}`);
        setHotel(response.data);
      } catch (error) {
        console.error("Error fetching hotel:", error);
        setError("Failed to load hotel details");

        if (error instanceof AxiosError) {
          setError(
            error.response?.data?.message || "Failed to load hotel details",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  return { hotel, loading, error };
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const { hotel, loading, error } = useHotelDetails(booking.hotelId);

  const checkedInMembers = booking.members.filter((member) => member.checkIn);
  const checkedInMembersCount = checkedInMembers.length;

  const notCheckedInMembers = booking.members.filter(
    (member) => !member.checkIn,
  );
  const notCheckedInMembersCount = notCheckedInMembers.length;

  return (
    <Card className="flex flex-col items-center rounded-lg border p-4 shadow-xl">
      <CardContent className={"p-0"}>
        {loading ? (
          <Skeleton className="h-4 w-32 mt-2" />
        ) : error ? (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        ) : (
          <div>
            {" "}
            <div className="font-bold text-slate-700 text-center antialiased text-2xl mt-2 tracking-widest mb-10">
              {hotel?.name.toUpperCase()}
              <p className={"text-muted-foreground text-sm mt-2 tracking-wide"}>
                {hotel?.location.toUpperCase()}
              </p>
            </div>
            <p className={"md:text-sm text-xs font-semibold my-4"}>
              Pending check in Members associated with your booking :
            </p>
            <NotCheckInMembersTable
              notCheckedInMembers={notCheckedInMembers}
              notCheckedInMembersCount={notCheckedInMembersCount}
            />
            {checkedInMembersCount > 0 && (
              <div>
                <p className={"text-sm font-semibold mt-6 mb-2"}>
                  Checked in Members associated with your booking :
                </p>
                <CheckedInMemberTable checkedInMembers={checkedInMembers} />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CheckedInMemberTable = ({
  checkedInMembers,
}: {
  checkedInMembers: Member[];
}) => {
  return (
    <Table className={"border"}>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Check In</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {checkedInMembers?.map((member: Member) => (
          <TableRow key={member.id}>
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleCheck color="#3ddb48" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You are already checked in.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const NotCheckInMembersTable = ({
  notCheckedInMembers,
  notCheckedInMembersCount,
}: {
  notCheckedInMembers: Member[];
  notCheckedInMembersCount: number;
}) => {
  const form = useForm<AadhaarFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aadhaar: "",
    },
  });

  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  interface HandleCheckInMember extends AadhaarFormSchema {
    member: Member;
  }

  const handleCheckInMember = async ({
    aadhaar,
    member,
  }: HandleCheckInMember) => {
    if (!aadhaar) {
      toast.error("Please fill in all fields");
      return;
    }

    if (parseInt(member.aadhaar) !== parseInt(aadhaar)) {
      toast.error("Aadhaar number does not match");
      return;
    }

    const bookingId = member.bookingId;
    startTransition(async () => {
      try {
        const { data: response } = await apiCaller.patch("/booking/checkIn", {
          aadhaar,
          bookingId,
        });
        toast.success("Check-in successful!", {
          description: response.message,
        });
        navigate(0);
        setIsDialogOpen(false);
      } catch (error: AxiosError | any) {
        if (error instanceof AxiosError) {
          toast.error("Check-in failed", {
            description: error.response?.data?.message || "Please try again",
          });
        } else {
          console.error(error);
          toast.error("Check-in failed", {
            description: "An unexpected error occurred",
          });
        }
      }
    });
  };

  return (
    notCheckedInMembersCount > 0 && (
      <Table className={"border"}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Check In</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notCheckedInMembers?.map((member: Member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">{member.name}</TableCell>
              <TableCell>
                <Dialog
                  open={isDialogOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      form.reset();
                    }
                    setIsDialogOpen(open);
                  }}
                >
                  <DialogTrigger className={"flex items-center gap-x-1"}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <TriangleAlert color="#e1d233" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to check in now!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Enter your aadhaar number to check-in
                      </DialogTitle>
                      <DialogDescription>
                        <Form {...form}>
                          <form
                            onSubmit={form.handleSubmit((data) =>
                              handleCheckInMember({
                                member,
                                aadhaar: data.aadhaar,
                              }),
                            )}
                          >
                            <FormField
                              control={form.control}
                              name="aadhaar"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Aadhaar Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="12-digit Aadhaar number"
                                      maxLength={12}
                                      inputMode={"numeric"}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              className={
                                "mt-4 hover:bg-blue-800 transition-all duration-200"
                              }
                              type="submit"
                              disabled={isPending}
                            >
                              {isPending ? (
                                <Loader className={"animate-spin size-5"} />
                              ) : (
                                <p>Check In</p>
                              )}
                            </Button>
                          </form>
                        </Form>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  );
};

export const Booking = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isPending, startTransition] = useTransition();

  const { user } = useAuthStore((state) => state);

  const fetchBookingsOfUser = async () => {
    try {
      const { data: response } = await apiCaller.get<BookingsResponse>(
        `/booking/${user?.id}`,
      );

      const bookings: Booking[] = response.data;

      if (bookings && bookings.length > 0) {
        toast.success("Bookings fetched successfully!");
        setBookings(bookings);
      } else {
        setBookings([]);
        toast.info("No bookings found");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Failed to fetch bookings", {
          description: error.response?.data?.message || "Please try again",
        });
      } else {
        console.error(error);
        toast.error("Failed to fetch bookings", {
          description: "An unexpected error occurred",
        });
      }
    }
  };

  useEffect(() => {
    if (user?.id) {
      startTransition(async () => {
        await fetchBookingsOfUser();
      });
    }
  }, [user?.id]);

  return (
    <section
      className={"container h-full min-h-[var(--height-screen)] w-full py-20"}
    >
      {isPending ? (
        <div>
          <Skeleton className="h-12 max-w-md mx-auto w-full mb-10" />
          <div
            className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}
          >
            {Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-lg border p-4 shadow-md"
              >
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      ) : bookings.length > 0 ? (
        <div>
          <h1 className={"text-2xl antialiased font-bold text-center mb-10"}>
            You have{" "}
            <span className={"text-blue-800 italic underline"}>
              {bookings.length}
            </span>{" "}
            bookings,{" "}
            <span className={"text-blue-800 italic"}>{user?.name}</span>
          </h1>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl font-bold">No Bookings to show!</p>
        </div>
      )}
    </section>
  );
};
