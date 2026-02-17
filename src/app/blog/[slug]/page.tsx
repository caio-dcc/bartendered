"use client";

import { useParams } from "next/navigation";
import { blogPosts } from "@/lib/blogData";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-bold mb-4">Article not found</h2>
        <Link href="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pb-20">
      {/* Hero Image */}
      <div className="relative h-[400px] w-full">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-4 md:p-12">
          <div className="container mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary-foreground/80 hover:text-primary mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold font-secondary text-primary mb-4 drop-shadow-sm">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 items-center text-foreground/80">
              <span className="flex items-center bg-background/30 backdrop-blur px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4 mr-2" /> {post.date}
              </span>
              <span className="flex items-center bg-background/30 backdrop-blur px-3 py-1 rounded-full">
                <User className="h-4 w-4 mr-2" /> {post.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 max-w-3xl">
        <div
          className="prose prose-invert prose-lg prose-headings:font-secondary prose-headings:text-primary prose-p:text-foreground/90 prose-a:text-primary hover:prose-a:underline"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-12 pt-8 border-t border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2 text-primary" /> Tags
          </h3>
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/40"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
