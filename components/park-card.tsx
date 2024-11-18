'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Users } from "lucide-react";
import Badge from "@/components/badge";

interface Park {
  isOpen: boolean;
  id: number;
  name: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  timezone?: string;
}

export default function ParkCard({
  park,
  fetchParkDetails,
}: Readonly<{
  park: Park;
  fetchParkDetails: (parkId: number) => void;
}>) {
  return (
    <Card
    key={park.id}
    className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    onClick={() => fetchParkDetails(park.id)}
  >
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        {park.name}
        <Badge isOpen={park.isOpen} />
      </CardTitle>
      <CardDescription className="flex items-center mt-2">
        <MapPin className="w-4 h-4 mr-2 dark:text-gray-400" />
        {park.country || "Unknown Country"}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground dark:text-gray-400">
        <Users className="w-4 h-4 mr-2 inline" />
        {park.continent || "Unknown Continent"}
      </p>
      <p className="text-sm text-muted-foreground dark:text-gray-400">
        <Clock className="w-4 h-4 mr-2 inline" />
        {park.timezone || "Unknown Timezone"}
      </p>
    </CardContent>
  </Card>
  );
}