import type { Project } from "~/types";
import ProjectCard from "./ProjectCard";

type FeaturedProjectsProps = {
    projects: Project[],
    count: number
}

const FeaturedProjects = ({ projects, count =  4 } : FeaturedProjectsProps) => {

    // no need to pull out features, as they are being pulled out at api level
    //const featured = projects.filter((p) => p.featured).slice(0, count);

    if ( projects.length == 0) return null;

    return (
      <>
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-200">
            🌟 Featured Projects
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      </>    
    );
}
 
export default FeaturedProjects;
