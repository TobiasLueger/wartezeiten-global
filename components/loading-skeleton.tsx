'use client'
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
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