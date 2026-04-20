import type { Route } from "./+types/index";
import PostCard from "~/components/PostCard";
//import type { PostMeta, StrapiResponse, StrapiPost } from '~/types';
import type { Post, StrapiResponse, StrapiPost } from '~/types';
import { useState } from 'react';
import Pagination from '~/components/Pagination';
import PostFilter from "~/components/PostFilter";

export function meta({}: Route.MetaArgs) {
  return [
    //{ title: "New React Router App" },
    { title: "Your friendly neighborhood Dev" },
    { name: "description", content: "Kev's Blogger Posts!" },
  ];
}

/* old, pre strapi
export async function loader({ request }: Route.LoaderArgs): Promise<{posts: PostMeta[]}> {
  const url = new URL('./posts-meta.json', request.url);
  const res = await fetch(url.href);
  if (!res.ok) throw new Error('Failed to fetch data');
  const data = await res.json();

  data.sort((a:PostMeta, b:PostMeta) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });  return { posts: data };
}
*/
export async function loader({
  request,
//}: Route.LoaderArgs): Promise<{ posts: PostMeta[] }> {
}: Route.LoaderArgs): Promise<{ posts: Post[] }> {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  const json: StrapiResponse<StrapiPost> = await res.json();

  const posts = json.data.map((item) => ({
    id: item.id,
    title: item.Title,
    excerpt: item.excerpt,
    slug: item.slug,
    date: item.date,
    body: item.body,
    image: item.image?.url
      //? `${import.meta.env.VITE_STRAPI_URL}${item.image.url}`
      ? `${item.image.url}`
      : '/images/no-image.png',
  }));

//  console.log(posts)

  return { posts };
}

const BlogPage = ({ loaderData }: Route.ComponentProps) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;  

  const { posts } = loaderData;

  const filteredPosts = posts.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query)
    )
  })
  //console.log(posts);

  // calculate total pages
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);  // no longer projects

  // Get current page's projects
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);  // same, not projects

  return (
    <div className='max-w-3xl mx-auto mt-10 px-6 py-6 bg-gray-900'>
      <h2 className='text-3xl font-bold mb-8 text-white'>📝 Blog</h2>

      <PostFilter searchQuery={searchQuery} onSearchChange={(query) => {
        setSearchQuery(query);
        setCurrentPage(1);
      }} />

      {/* replace {posts.map((p) => (<PostCard key={p.slug} post={p} />))} with ... below the 'NO' line */}
      {/*NO ... <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />*/}
      <div className='space-y-8'>
        {currentPosts.length === 0 ? (
          <p className='text-gray-400 text-center'>No posts found.</p>
        ) : (
          currentPosts.map((post) => <PostCard key={post.slug} post={post} />)
        )}
      </div>
      {
        totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={(page) => setCurrentPage(page)}
          />
        )
      }
    </div>
  );
};

export default BlogPage;
//https://www.markdownguide.org/cheat-sheet/
//https://stackedit.io/
