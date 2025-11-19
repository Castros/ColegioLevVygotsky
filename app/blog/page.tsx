import { getBlogPosts } from "@/lib/api";
import { BlogFilter } from "./BlogFilter";

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="w-full bg-slate-800">
        <div className="container mx-auto p-4 md:p-8">
          <div
            className="flex min-h-[400px] flex-col gap-6 items-center justify-center rounded-xl md:rounded-xl bg-cover bg-center bg-no-repeat p-6 text-center"
            style={{
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5) 0%, rgba(15, 23, 42, 0.7) 100%), url("/images/colored-pencils-on-beige-surface.jpeg")`
            }}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-white text-4xl font-black leading-tight tracking-tighter md:text-6xl">
                Nuestro Blog Escolar
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid & Sidebar */}
      <section className="container mx-auto px-4 md:px-8 py-8">
        <BlogFilter posts={blogPosts} />
      </section>
    </div>
  );
}
