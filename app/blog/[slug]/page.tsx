import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/api";
import { getStrapiMedia } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { ShareButton } from "./ShareButton";


export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get all posts and filter out the current one, then take 2
  const allPosts = await getBlogPosts();
  const otherPosts = allPosts.filter(p => p.id !== post.id);
  const relatedPosts = otherPosts.slice(0, 2);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50">
      {/* Content */}
      <section className="container mx-auto px-4 md:px-8 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between gap-3 mb-6">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-slate-900 text-3xl lg:text-4xl font-black leading-tight tracking-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  {post.author?.[0] || 'V'}
                </div>
                <p className="text-slate-600 text-sm font-normal leading-normal">
                  Por {post.author || 'Colegio Lev Vygotsky'} | {new Date(post.published_date).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Header Image */}
          <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl h-64 lg:h-80 mb-6 relative">
            <Image
              src={getStrapiMedia(post.featured_image.url) || '/images/placeholder.jpg'}
              alt={post.featured_image.alternativeText || post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Article Container - Two Column Layout */}
          <div className="grid grid-cols-12 gap-6">
            {/* Body Text */}
            <div className="col-span-12 lg:col-span-9">
              {/* Excerpt */}
              <div className="mb-6">
                <p className="text-lg text-slate-900 font-medium leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Main Content */}
              <article className="prose max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: post.content }}
                  className="text-slate-900 text-base leading-relaxed [&>p]:text-slate-900 [&>p]:mb-4 [&>h2]:text-slate-900 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-3 [&>h3]:text-slate-900"
                />
              </article>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">
                    Artículos Relacionados
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="flex flex-col gap-2 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover relative">
                          {relatedPost.featured_image && (
                            <Image
                              src={getStrapiMedia(relatedPost.featured_image.url) || '/images/placeholder.jpg'}
                              alt={relatedPost.featured_image.alternativeText || relatedPost.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="p-3">
                          <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            {typeof relatedPost.category === 'string' ? relatedPost.category : relatedPost.category?.name}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Back to Blog */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver al Blog
                </Link>
              </div>
            </div>

            {/* Social Share Sidebar */}
            <aside className="col-span-12 lg:col-span-3">
              <div className="sticky top-24 flex flex-row lg:flex-col gap-3">
                <p className="text-xs font-bold text-slate-600 hidden lg:block uppercase tracking-wide">Compartir</p>
                <div className="flex flex-row lg:flex-col gap-2">
                  <ShareButton title={post.title} slug={post.slug} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
