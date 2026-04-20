import type { Route } from "./+types/index";
import { useEffect } from "react";
//import { Welcome } from "../welcome/welcome";
//import Hero from "~/components/Hero";
import FeaturedProjects from "~/components/FeaturedProjects";
import type { Project, StrapiPost, StrapiProject, StrapiResponse } from '~/types';
import AboutPreview from '~/components/about-preview';
//import type { PostMeta } from "~/types";
import type { Post } from "~/types";
import LatestPosts from "~/components/LatestPosts";

export function meta({}: Route.MetaArgs) {
  return [
    //{ title: "New React Router App" },
    { title: "Your friendly neighborhood Dev" },
    { name: "description", content: "Kev's Custom Website Dev!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs): 
  //Promise<{projects: Project[]; posts: PostMeta[]}> {
  Promise<{projects: Project[]; posts: Post[]}> {
  const url = new URL(request.url);

  //const [projectRes, postRes] = await Promise.all([
  //  fetch(`${import.meta.env.VITE_API_URL}/projects?populate=*`),
  //  fetch(new URL('./posts-meta.json', url)),
  //]);

  // get  only the featured ones ...
  const [projectRes, postRes] = await Promise.all([
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/projects?filters[featured][$eq]=true&populate=*`
    ),
    //(new URL('/data/posts-meta.json', url)), // We'll change this to Strapi later!
    fetch(
      //`${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`
      `${
        import.meta.env.VITE_API_URL
      }/posts?sort[0]=date:desc&populate=*`  //  multilevel sort, date firts, can add more
    ),
  ]);

  //const res = await fetch(
  //  `${import.meta.env.VITE_API_URL}/posts?populate=image&sort=date:desc`
  //);


  if (!projectRes.ok || !postRes.ok) { throw new Error('Failed to fetch projects or posts'); }

  /// these gotta change due to strapi 
  ///const [projects, posts] = await Promise.all([
  ///  projectRes.json(),
  ///  postRes.json()
  ///]);

  //console.log(projects, posts);

  ///return { projects, posts };

  //const [projectsJson, posts] = await Promise.all([
  //  projectRes.json(),
  //  postRes.json()
  //]);

  const projectJson: StrapiResponse<StrapiProject> = await projectRes.json();
  //const postJson = await postRes.json();
  const postJson: StrapiResponse<StrapiPost> = await postRes.json();

  //const json:StrapiResponse<StrapiProject> = await res.json();

  const projects = projectJson.data.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    description: item.description,
    image: item.image?.url
      //? `${import.meta.env.VITE_STRAPI_URL}${item.image.url}`
      ? `${item.image.url}`
      : '/images/no-image.png',
    url: item.url,
    date: item.date,
    category: item.category,
    featured: item.featured,
  }));

  const posts = postJson.data.map((item) => ({
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

  //console.log(projectsJson.data[0]?.image)

  //return { projects, posts: postJson };
  return { projects, posts };

}

//export default function Home() {
const HomePage = ({ loaderData }:Route.ComponentProps) => {
  const { projects, posts } = loaderData;

  useEffect(() => {
    console.log(window.scrollX);  // works here on mount
  }, []);

  // console.log(projects); SSR

  //return <Welcome />;
  //console.log("hey")
  //const now = new Date().toISOString();
  //if (typeof window === 'undefined') {
  //  console.log('🖥️ Server Render at:', now);
  //} else {
  //  console.log('🧠 Client Hydration at:', now);
  //}  
//      <section>HOMEPAGE
//      {/* <Hero name='Kevin' text='bum'/> */}
//      </section>

  //console.log(window.scrollX);  // fails here, cuz hydration not occur
  return (
    <>
      <FeaturedProjects projects={projects} count={2}/>
      <AboutPreview />
      <LatestPosts posts={posts} limit={4} />
    </>
  );
}

export default HomePage;