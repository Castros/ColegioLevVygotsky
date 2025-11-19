'use client';

import { useState, useMemo } from 'react';
import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/strapi";
import type { BlogPost } from "@/lib/types";

interface BlogFilterProps {
  posts: BlogPost[];
}

export function BlogFilter({ posts }: BlogFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Academics', 'Student Life', 'School Events', 'Alumni News', 'Teacher Spotlights'];

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Content: Posts */}
      <div className="lg:col-span-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="flex flex-col gap-3 pb-3 bg-white rounded-xl p-4 transition-shadow hover:shadow-lg border border-slate-200"
              >
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg relative overflow-hidden">
                  {post.featured_image && (
                    <Image
                      src={getStrapiMedia(post.featured_image.url) || '/images/placeholder.jpg'}
                      alt={post.featured_image.alternativeText || post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                </div>
                <div>
                  <p className="text-base font-bold leading-normal text-slate-800">{post.title}</p>
                  <p className="text-slate-600 text-sm font-normal leading-normal mt-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <p className="text-slate-500 text-xs font-normal leading-normal">
                      {new Date(post.published_date).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-slate-600">
                No se encontraron publicaciones que coincidan con tu búsqueda.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
        {/* Search Bar */}
        <div>
          <label className="flex flex-col min-w-40 h-12 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-slate-500 flex border-none bg-slate-100 items-center justify-center pl-4 rounded-l-xl border-r-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl text-slate-900 focus:outline-0 focus:ring-2 focus:ring-green-600/50 border-none bg-slate-100 h-full placeholder:text-slate-500 px-4 pl-2 text-base font-normal leading-normal"
                placeholder="Buscar artículos..."
              />
            </div>
          </label>
        </div>

        {/* Categories */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <h3 className="text-lg font-bold mb-4 text-slate-800">Categorías</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg px-3 transition-colors ${
                selectedCategory === null
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 hover:bg-green-50 hover:text-green-700 text-slate-700'
              }`}
            >
              <p className="text-sm font-medium">Todas</p>
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex h-8 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg px-3 transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 hover:bg-green-50 hover:text-green-700 text-slate-700'
                }`}
              >
                <p className="text-sm font-medium">{category}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
