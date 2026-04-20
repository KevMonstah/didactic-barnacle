import type { ComponentProps } from 'react';
import type { Route } from './+types/details';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router';
import type { Project, StrapiResponse, StrapiProject } from '~/types';

// this for CLIENT.  should be SSR though.
// change to loader for strapi
//export async function clientLoader({ request, params }:Route.ClientLoaderArgs):Promise<Project> {
export async function loader({ request, params }:Route.LoaderArgs) {

  //const res = await fetch(`http://localhost:8000/projects/${params.id}`);
  //const res = await fetch(`${import.meta.env.VITE_API_URL}/projects/${params.id}`);  // this works, but we getting an array
  const { id } = params;  // is 'id' and not 'documentId' due to description in routes.ts file.
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projects?filters[documentId][$eq]=${id}&populate=*`);


  if (!res.ok) {
    throw new Response('Project not found', { status: 404 });
  }

  const json:StrapiResponse<StrapiProject> = await res.json();
  const item = json.data[0];
  const project:Project = {
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

  }

  //const project: Project = await res.json();
  return {project};  // not just  return project;
}

/*
With client loaders, we are fetching the data on the client side, so we need to handle the loading state. We can do this by exporting a function called `hydrationFallback`. This function will be called when the component is mounted on the client side. We can use it to show a loading state while the data is being fetched.
* /

no longer needed with regular loader
export function HydrateFallback() {
  return <div>Loading...</div>;
}
*/

const ProjectDetailsPage = ({ loaderData }:Route.ComponentProps) => {
  const { project } = loaderData;  // now it's a project, so destructure it
  //console.log(project);
  return (
    <>
      {/* Go Back Button */}
      <Link
        to='/projects'
        className='flex items-center text-blue-400 hover:text-blue-500 mb-6 transition'
      >
        <FaArrowLeft className='mr-2' />
        Back to Projects
      </Link>
      <div className='grid md:grid-cols-2 gap-8 items-start'>
        {/* Project Image */}
        <div>
          <img
            src={project.image}
            alt={project.title}
            className='w-full rounded-lg shadow-md'
          />
        </div>

        {/* Project Info */}
        <div>
          <h1 className='text-3xl font-bold text-blue-400 mb-4'>
            {project.title}
          </h1>
          <p className='text-gray-300 text-sm mb-4'>
            {new Date(project.date).toLocaleDateString()} • {project.category}
          </p>
          <p className='text-gray-200 mb-6'>{project.description}</p>

          <a
            href={project.url}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition'
          >
            View Live Site →
          </a>
        </div>
      </div>
    </>
  );
}
 
export default ProjectDetailsPage;


// testing a CLIENT loader first
