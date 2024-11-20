'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/badge";

interface Ride {
  id: number;
  name: string;
  is_open: boolean;
  wait_time: number;
  last_updated: string;
}

function getWaitTimeColor(waitTime: number): string {
  if (waitTime <= 15) {
    return 'dark:text-green-400 text-green-700';
  } else if (waitTime <= 30) {
    return 'dark:text-orange-400 text-orange-500';
  } else {
    return 'dark:text-red-500 text-red-600';
  }
}

export default function RideCard({
  ride,
}: Readonly<{
  ride: Ride;
}>) {
  return (
    <Card
      key={ride.id}
      className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {ride.name}
          <Badge isOpen={ride.is_open} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-bold text-muted-foreground">
          <span className={`text-sm text-muted-foreground dark:text-gray-400`}>Waiting Time - </span>
          <span className={`text-sm ${getWaitTimeColor(ride.wait_time)}`}>{ride.wait_time} minutes</span>
        </p>
        <p className="text-sm text-muted-foreground dark:text-gray-400">
          Last Updated:{" "}
          {new Date(
            ride.last_updated
          ).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}