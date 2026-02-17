"use client";

import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Thoughts & Spirits
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-secondary text-primary">
            The Mixology Journal
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Insights, history, and techniques from behind the bar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-primary/20 bg-card/50 backdrop-blur group overflow-hidden">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2 text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> {post.date}
                    </span>
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" /> {post.author}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-secondary text-primary group-hover:underline decoration-primary underline-offset-4">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 line-clamp-3 text-sm">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs bg-secondary/30 text-secondary-foreground hover:bg-secondary/50"
                    >
                      {tag}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
