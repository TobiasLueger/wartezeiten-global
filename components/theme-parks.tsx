"use client";

import React, { useState, useEffect } from "react";
import { Clock, MapPin, Users, Search, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

interface Ride {
  id: number;
  name: string;
  is_open: boolean;
  wait_time: number;
  last_updated: string;
}

interface Land {
  id: number;
  name: string;
  rides: Ride[];
}

interface ParkDetails {
  lands: Land[];
  rides: Ride[];
}

const Badge: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded ${
      isOpen
        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
    }`}
  >
    {isOpen ? "Open" : "Closed"}
  </span>
);

export default function Component() {
  const [parks, setParks] = useState<Park[]>([]);
  const [filteredParks, setFilteredParks] = useState<Park[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedPark, setSelectedPark] = useState<ParkDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParks() {
      try {
        const response = await fetch("/api/parks");
        if (!response.ok) throw new Error("Failed to fetch park data");
        const parkList = await response.json();

        setParks(parkList);
        setFilteredParks(parkList); // Default to showing all parks
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchParks();
  }, []);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, selectedCountry);
  };

  const handleCountryChange = (country: string | null) => {
    setSelectedCountry(country);
    applyFilters(searchQuery, country);
  };

  const applyFilters = (query: string, country: string | null) => {
    let result = parks;

    if (query) {
      result = result.filter((park) =>
        park.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (country) {
      result = result.filter((park) => park.country === country);
    }

    setFilteredParks(result);
  };

  async function fetchParkDetails(parkId: number) {
    try {
      setLoadingDetails(true);
      const response = await fetch(`/api/queueTime/${parkId}`);
      if (!response.ok) throw new Error("Failed to fetch park details");
      const data = await response.json();
      setSelectedPark(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoadingDetails(false);
    }
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-red-500 dark:text-red-300">Error: {error}</div>
      </div>
    );
  }

  const uniqueCountries = [
    ...new Set(parks.filter(Boolean).map((park) => park.country).filter(Boolean)),
  ];

  console.log(parks);

  return (
    <div className="container mx-auto py-2 px-4">
      {!selectedPark ? (
        <>
          <div className="mb-6">
            {!selectedPark && (
              <div className="flex items-center gap-4">
                <div className="relative w-full">
                  <Input
                    placeholder="Search parks by name"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 dark:bg-gray-800 dark:text-white"
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground dark:text-gray-400" />
                </div>
                <Select
                  onValueChange={(value) =>
                    handleCountryChange(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger className="w-64 dark:bg-gray-800 dark:text-white">
                    <SelectValue placeholder="Filter by country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredParks.map((park) => (
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
            ))}
          </div>
        </>
      ) : (
        <div>
          {loadingDetails ? (
            <Skeleton className="h-12 w-full dark:bg-gray-700" />
          ) : (
            <>
              <button
                onClick={() => setSelectedPark(null)}
                className="text-sm text-muted-foreground hover:text-primary dark:text-gray-400 dark:hover:text-white mb-4 flex justify-center items-center gap-2"
              >
                <ArrowLeft size={18}/> Back to all parks
              </button>
              <h1 className="text-4xl font-bold mb-4 dark:text-white">
                Park Details
              </h1>
              <div className="space-y-6">
                {selectedPark.lands.length > 0 ? (
                  selectedPark.lands.map((land) => (
                    <div key={land.id} className="space-y-4">
                      <h2 className="text-2xl font-semibold dark:text-white">
                        {land.name}
                      </h2>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {land.rides.map((ride) => (
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
                              <p className="text-sm font-bold text-muted-foreground dark:text-white">
                              <span className="text-sm text-muted-foreground dark:text-gray-400">Waiting Time - </span>{ride.wait_time} minutes
                              </p>
                              <p className="text-sm text-muted-foreground dark:text-gray-400">
                                Last Updated:{" "}
                                {new Date(
                                  ride.last_updated
                                ).toLocaleString()}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <h2 className="text-2xl font-semibold dark:text-white">
                      Rides
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {selectedPark.rides.map((ride) => (
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
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              Wait Time: {ride.wait_time} minutes
                            </p>
                            <p className="text-sm text-muted-foreground dark:text-gray-400">
                              Last Updated:{" "}
                              {new Date(ride.last_updated).toLocaleString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-12 w-48 mb-8 dark:bg-gray-700" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <Skeleton className="h-8 w-64 mb-2 dark:bg-gray-700" />
              <Skeleton className="h-4 w-32 dark:bg-gray-700" />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}