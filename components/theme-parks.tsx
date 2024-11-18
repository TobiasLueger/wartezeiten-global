"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import ParkCard from "./park-card";
import RideCard from "./ride-card";
import LoadingSkeleton from "./loading-skeleton";

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
              <ParkCard key={park.id} park={park} fetchParkDetails={fetchParkDetails}/>
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
                          <RideCard ride={ride} key={ride.id} />
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
                        <RideCard ride={ride} key={ride.id} />
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
