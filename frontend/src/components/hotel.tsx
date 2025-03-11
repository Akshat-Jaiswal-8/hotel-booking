import { useEffect, useState, useTransition } from "react";
import { apiCaller } from "@/lib/api-caller.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Input } from "@/components/ui/input.tsx";
import * as z from "zod";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { AxiosError } from "axios";

const formSchema = z.object({
  familyMembers: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, {
            message: "Name must be at least 2 characters.",
          })
          .max(50, {
            message: "Name must not exceed 50 characters.",
          }),
        aadhaar: z
          .string()
          .length(12, {
            message: "Aadhaar number must be exactly 12 digits.",
          })
          .regex(/^\d+$/, {
            message: "Aadhaar must contain only numbers.",
          }),
      }),
    )
    .min(1, { message: "At least one family member is required." }),
});

export type FamilyFormValues = z.infer<typeof formSchema>;

export const Hotel = () => {
  const [hotels, setHotels] = useState<Hotel[] | []>([]);
  const [isPending, startTransition] = useTransition();
  const [isBookingPending, startBookingTransition] = useTransition();
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAuthStore((state) => state);

  const form = useForm<FamilyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      familyMembers: [
        {
          name: "",
          aadhaar: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "familyMembers",
  });

  const handleSubmit: SubmitHandler<FamilyFormValues> = ({ familyMembers }) => {
    if (!selectedHotelId) return;
    if (!user) {
      toast.error("Please login to book a hotel");
      return;
    }

    startBookingTransition(async () => {
      try {
        const { data } = await apiCaller.post(`/booking`, {
          hotelId: selectedHotelId,
          userId: user?.id,
          familyMembers,
        });

        if (data) {
          toast.success("Booking successful!");
          setIsDialogOpen(false);
          form.reset();
        } else {
          toast.error("Booking failed");
        }
      } catch (error: AxiosError | any) {
        if (error instanceof AxiosError) {
          toast.error("Booking failed", {
            description: error.response?.data?.message || "Please try again",
          });
        } else {
          console.error(error);
          toast.error("Booking failed", {
            description: "An unexpected error occurred",
          });
        }
      }
    });
  };

  const fetchHotels = async () => {
    const { data: hotelData } = await apiCaller.get<{ data: Hotel[] }>(
      "/hotel/hotels",
    );
    setHotels(hotelData.data);
  };

  useEffect(() => {
    startTransition(async () => {
      await fetchHotels();
    });
  }, []);

  return (
    <section
      className={"container h-full min-h-[var(--height-screen)] w-full py-20"}
    >
      {isPending ? (
        <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
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
      ) : hotels.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="flex flex-col items-center rounded-lg border p-4 shadow-md"
            >
              <CardContent>
                <h2 className="text-xl font-bold">{hotel.name}</h2>
                <p className="text-gray-600">{hotel.location}</p>
              </CardContent>
              <CardFooter>
                <Dialog
                  open={isDialogOpen && selectedHotelId === hotel.id}
                  onOpenChange={(open) => {
                    if (!open) {
                      form.reset();
                      setSelectedHotelId(null);
                    }
                    setIsDialogOpen(open);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      className={"hover:bg-blue-800 transition-all"}
                      onClick={() => setSelectedHotelId(hotel.id)}
                    >
                      BOOK
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={"max-w-md w-full max-h-[80vh] overflow-y-auto"}
                  >
                    <DialogHeader>
                      <DialogTitle>Add Family Members</DialogTitle>
                      <DialogDescription>
                        Please add all family members who will be staying
                      </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                      >
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="space-y-4 p-4 border rounded-lg relative"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-sm font-medium">
                                Member {index + 1}
                              </h3>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>

                            <FormField
                              control={form.control}
                              name={`familyMembers.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter name"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`familyMembers.${index}.aadhaar`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Aadhaar Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="12-digit Aadhaar number"
                                      maxLength={12}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => append({ name: "", aadhaar: "" })}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Add Family Member
                        </Button>

                        <DialogFooter className="mt-6">
                          <Button
                            type="submit"
                            className="w-full hover:bg-blue-800 transition-all duration-200"
                            disabled={isBookingPending}
                          >
                            {isBookingPending ? (
                              <Loader
                                className={"animate-spin size-4"}
                              ></Loader>
                            ) : (
                              "Complete Booking"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-lg">No hotels available</p>
        </div>
      )}
    </section>
  );
};
