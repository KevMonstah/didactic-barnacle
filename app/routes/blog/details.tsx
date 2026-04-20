import ReactMarkdown from "react-markdown";
import type { Route } from "./+types/details";
//import type { StrapiResponse, StrapiPost, PostMeta } from '~/types';
import type { StrapiResponse, StrapiPost, Post } from '~/types';
import type { BlogPostDetailsPageProps } from "~/types";
import { Link } from "react-router";

export async function loader({ request, params } : Route.LoaderArgs ) {
    const { slug } = params;
    //console.log(slug);

  // pre strapi
  //const url = new URL('/data/posts-meta.json', request.url);
  //const res = await fetch(url.href);

  const res = await fetch(
    `${
      import.meta.env.VITE_API_URL
    }/posts?filters[slug][$eq]=${slug}&populate=image`
  );

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  // pre strapi
  //const index = await res.json();
  //const postMeta = index.find((post: PostMeta) => post.slug === slug);  // don't return all, only where slug matches

  const json: StrapiResponse<StrapiPost> = await res.json();

  if (!json.data.length) {
    throw new Response('Not Found', { status: 404 });
  }

  const item = json.data[0];

  // also pre strapi
  //if (!postMeta) throw new Response('Not Found', {status: 404});

  // dynamically import raw markdown.  NOTE:  SLUG *MUST* MATCH FILENAME EXACTLY
  //const markdown = await import(`../../posts/${slug}.md?raw`);

  //return {
  //  postMeta,
  //  markdown: markdown.default
  //};
//  const post: PostMeta = {
  const post: Post = {
    id: item.id,
    slug: item.slug,
    title: item.Title,
    excerpt: item.excerpt,
    body: item.body,
    date: item.date,
    image: item.image?.url
      //? `${import.meta.env.VITE_STRAPI_URL}${item.image.url}`
      ? `${item.image.url}`
      : '/images/no-image.png',
  };

  return { post };
}

/* old, pre strapi
const BlogDetailsPage = ({ loaderData }: BlogPostDetailsPageProps) => {
    const { postMeta, markdown } = loaderData;
    console.log(postMeta, markdown);

    return (
      <div className='max-w-3xl mx-auto px-6 py-12 bg-gray-900'>
        <h1 className='text-3xl font-bold text-blue-400 mb-2'>
          {postMeta.title}
        </h1>
        <p className='text-sm text-gray-400 mb-6'>
          {new Date(postMeta.date).toDateString()}
        </p>

        {/ * Markdown * /}
        <div className='prose prose-invert max-w-none mb-12'>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>

        <div className='text-center'>
          <Link
            to='/blog'
            className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
          >
            ← Go Back to Posts
          </Link>
        </div>
      </div> 
    );
}
 
*/

/* using toDateString instead of toLocaleDateString gets the day */

//const BlogPostDetailsPage = ({ loaderData }: Route.ComponentProps) => {
const BlogPostDetailsPage = ({ loaderData }: BlogPostDetailsPageProps) => {
  const { post } = loaderData;

  return (
    <div className='max-w-3xl mx-auto px-6 py-12 bg-gray-900'>
      <h1 className='text-3xl font-bold text-blue-400 mb-2'>{post.title}</h1>
      <p className='text-sm text-gray-400 mb-6'>
        {new Date(post.date).toLocaleDateString()}
      </p>
      <img
        src={post.image}
        alt={post.title}
        className='w-full h-64 object-cover mb-4'
      />

      <div className='prose prose-invert max-w-none mb-12'>
        THE BODY
        <ReactMarkdown>{post.body}</ReactMarkdown>
      </div>

      <div className='text-center'>
        <Link
          to='/blog'
          className='inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
        >
          ← Go Back to Posts
        </Link>
      </div>
    </div>
  );
};

export default BlogPostDetailsPage;
