import type { Route } from './+types/index';
import type { Project, StrapiProject, StrapiResponse } from '~/types';
import ProjectCard from '~/components/ProjectCard';
import { useState } from 'react';
import Pagination from '~/components/Pagination';
import { AnimatePresence, motion } from 'framer-motion';

//const VITE_API_URL="http://localhost:8000";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your friendly neighborhood Dev | PROJECTS" },
    { name: "description", content: "Portfolio" },
  ];
}

export async function loader({ request }: Route.LoaderArgs): Promise<{projects: Project[]}> {
  //const res = await fetch('http://localhost:8000/projects');
  //console.log("env:", process.env.VITE_API_URL);
  const res = await fetch(`${import.meta.env.VITE_API_URL}/projects?populate=*`);
  //const res = await fetch(`${VITE_API_URL}/projects`);
  //const data = await res.json();
  //console.log(data);

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  const json:StrapiResponse<StrapiProject> = await res.json();

  const projects = json.data.map((item) => ({
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

  return { projects };
  //return { projects: data };
}  

/*
export async function loader({ params }: Route.LoaderArgs):
Promise<any> {
  const res = await fetch('http://localhost:8000/projects');
  const data = await res.json();
  console.log(data);


  return { projects: data};
}

const ProjectsPage = ({ loaderData} : Route.ComponentProps) => { 
  const { projects } = loaderData;
  console.log(projects);

  return (
    <>
      <h2 className='text-3xl font-bold mb-8 text-black'>🚀 Projects</h2>
    </>
  );
};

export default ProjectsPage;
*/
const ProjectsPage = ({ loaderData }: Route.ComponentProps) => {

  const [selectedCategory, setSelectedCategory] = useState('All');  //'All' is default
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;  


  const { projects } = loaderData as { projects: Project[] };

  // get unique categories ...
  const categories = ['All', ...new Set(projects.map((p) => p.category))];
  //console.log(projects);
  //console.log(categories);

  // filter based  on category
  const filteredProjects = selectedCategory === 'All' ? projects :
     projects.filter((p) => p.category === selectedCategory);

  // calculate total pages
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);  // no longer projects

  // Get current page's projects
  const indexOfLast = currentPage * projectsPerPage;
  const indexOfFirst = indexOfLast - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast);  // same, not projects

  // pagination button render
  /*
Let's look at this code: 

```js
Array.from({ length: totalPages }, (_, idx) => ...)
````
The `Array.from()` creates a new array with totalPages number of items.

The second argument is a map function, where `_` is the value (not used) and `idx` is the index (starting at 0)

So if `totalPages = 3`, this produces:

```
[0, 1, 2] → turned into buttons for [1, 2, 3]
```

The underscore _ is just a throwaway variable — it represents the value of each item in the array, but in this case, it's not used at all. We don't need a value, we just need the index to generate page numbers and keys for our buttons.

  */
 /*
  const renderPagination = () => (
    <div className='flex justify-center gap-2 mt-8'>
      {Array.from({ length: totalPages }, (_, idx) => (
        <button
          key={idx + 1}
          onClick={() => setCurrentPage(idx + 1)}
          className={`px-3 py-1 cursor-pointer rounded ${
            currentPage === idx + 1
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200'
          }`}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
*/
  return (
    <>
      <h2 className='text-3xl text-white font-bold mb-8'>🚀 Projects</h2>

      {
        /* Category Filter */
      }
      <div className='flex flex-wrap gap-2 mb-8'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              // Reset page number to 1 when category is changed
              setCurrentPage(1);
            }}
            className={`px-3 py-1 rounded text-sm ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode='wait'>
        <motion.div layout className='grid gap-6 sm:grid-cols-2'>
          {/*{projects.map((project) => (  */}
          {currentProjects.map((project) => (
            <motion.div key={project.id} layout >
              <ProjectCard project={project} />
            </motion.div>
            // <ProjectCard project={project} />
            // <div
            //   key={project.id}
            //   className='bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shadow-sm transition hover:shadow-md'
            // >
            //   <img src={project.image} alt={project.title} className='w-full h-40 object-cover' />
            //   <div className="p-5">
            //     <h3 className='text-xl font-semibold text-blue-400 mb-1'>
            //       {project.title}
            //     </h3>
            //     <p className='text-sm text-gray-300 mb-2'>
            //       {project.description}
            //     </p>
            //     <div className='flex justify-between items-center text-sm text-gray-400'>
            //       <span>{project.category}</span>
            //       <span>{new Date(project.date).toLocaleDateString()}</span>
            //     </div>
            //   </div>
            // </div>
          ))}
        </motion.div>
      </AnimatePresence>
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
    </>
  );
};

export default ProjectsPage;

/*

why doesn't this resolve with a .env file containing VITE_API_URL="http://localhost:8000" when you can test with a local const VITE_API_URL set to the same value successfully?

This is a classic gotcha with Vite environment variables. If a hardcoded constant works but your .env value doesn’t, the issue is almost always how Vite loads and exposes env vars.

Here are the main reasons this happens:

⚠️ 1. You’re not accessing it correctly

In Vite, env variables are not available via process.env like in Node.

✅ Correct:

const apiUrl = import.meta.env.VITE_API_URL;

❌ Wrong:

process.env.VITE_API_URL
⚠️ 2. The dev server wasn’t restarted

Vite only loads .env files at startup.

If you added or changed:

.env

You must restart:

npm run dev
⚠️ 3. File naming matters

Make sure your file is exactly one of these:

.env
.env.local
.env.development

If you used something like:

.env.dev   ❌ (won’t load)
⚠️ 4. Variable must start with VITE_

Vite ignores everything else for client-side code.

✅ Works:

VITE_API_URL=http://localhost:8000

❌ Ignored:

API_URL=http://localhost:8000
⚠️ 5. Don’t wrap in quotes (sometimes causes issues)

Try removing quotes:

VITE_API_URL=http://localhost:8000

While quotes can work, they occasionally lead to subtle parsing issues depending on setup.

⚠️ 6. Using it outside Vite context

If you're trying to access it in:

vite.config.js → use loadEnv
backend code → .env won’t be injected

Example for config:

import { defineConfig, loadEnv } from 'vite';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    define: {
      __API_URL__: env.VITE_API_URL
    }
  };
};
⚠️ 7. Build vs dev mismatch

If you're testing a production build:

npm run build
npm run preview

Make sure the .env.production (or .env) has the value.

⚠️ 8. Path or placement issue

Your .env file must be in the project root, not inside:

src/
config/
🧪 Quick debug checklist

Add this temporarily:

console.log(import.meta.env);

If VITE_API_URL is missing → Vite didn’t load it.

🧠 Why your local const works

When you do:

const VITE_API_URL = "http://localhost:8000";

That’s just normal JavaScript—no build-time injection needed.

But .env variables in Vite are:

Injected at build time
Statically replaced in code

So if anything in the pipeline fails → they appear undefined.

✅ Most likely cause

In practice, 90% of the time it's one of these:

Forgot to restart dev server
Used process.env instead of import.meta.env
.env is misnamed or misplaced

If you paste your snippet where you're reading the variable, I can pinpoint the exact issue quickly.

[TypeError: Failed to parse URL from undefined/projects] {
  [cause]: TypeError: Invalid URL
      at new URL (node:internal/url:819:25)
      at new Request (node:internal/deps/undici/undici:11063:25)
      at fetch (node:internal/deps/undici/undici:11988:25)
      at fetch (node:internal/deps/undici/undici:16555:10)
      at fetch (node:internal/bootstrap/web/exposed-window-or-worker:83:12)
      at loader (C:/NewTestingDir/TraversyMedia/v2/section11/friendly-dev/app/routes/projects/index.tsx:30:21)
      at callRouteHandler (file:///C:/NewTestingDir/TraversyMedia/v2/section11/friendly-dev/node_modules/react-router/dist/development/chunk-FNSCYPCZ.mjs:509:22)
      at commonRoute.loader (file:///C:/NewTestingDir/TraversyMedia/v2/section11/friendly-dev/node_modules/react-router/dist/development/chunk-FNSCYPCZ.mjs:659:25)
      at actualHandler (file:///C:/NewTestingDir/TraversyMedia/v2/section11/friendly-dev/node_modules/react-router/dist/development/chunk-EPOLDU6W.mjs:4755:14)
      at file:///C:/NewTestingDir/TraversyMedia/v2/section11/friendly-dev/node_modules/react-router/dist/development/chunk-EPOLDU6W.mjs:4767:91 {
    code: 'ERR_INVALID_URL',
    input: 'undefined/projects'

This error tells you exactly what’s wrong once you read it literally:

Failed to parse URL from undefined/projects

👉 Your base URL is undefined, so when you do something like:

fetch(`${VITE_API_URL}/projects`)

it becomes:

fetch("undefined/projects") // 💥 crash
🧠 The real issue (important)

You’re calling this inside a React Router loader, which runs in a Node environment, not the browser.

That changes everything.

⚠️ Why your .env isn’t working here

In Vite:

import.meta.env.VITE_* → only works in client-side code
Your loader runs on the server (Node)

So:

import.meta.env.VITE_API_URL

👉 is undefined in the loader

✅ Fix options
✅ Option 1 (most common): Use process.env in loaders

Your loader is server-side, so use Node env vars:

.env
VITE_API_URL=http://localhost:8000
loader:
const apiUrl = process.env.VITE_API_URL;

await fetch(`${apiUrl}/projects`);
⚠️ But there’s a catch

Vite does NOT automatically load .env into Node runtime.

So this might still be undefined unless you load it.

✅ Option 2: Use dotenv (recommended for SSR/loaders)

Install:

npm install dotenv

Then at your app entry (or loader file):

import dotenv from "dotenv";
dotenv.config();

Now this works:

const apiUrl = process.env.VITE_API_URL;
✅ Option 3: Hardcode via Vite config (advanced)

Expose it manually:

// vite.config.js
import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  });
};

Then:

fetch(`${__API_URL__}/projects`);
✅ Option 4: Split client vs server envs (best practice)

Use:

VITE_API_URL=http://localhost:8000   # client
API_URL=http://localhost:8000        # server

Then:

Client:
import.meta.env.VITE_API_URL
Loader (server):
process.env.API_URL
🔍 Why your local const worked
const VITE_API_URL = "http://localhost:8000";

This works because:

It exists in both environments
No build/runtime injection needed
🧪 Quick debug (do this now)

Inside your loader:

console.log("env:", process.env.VITE_API_URL);

If you see:

undefined

👉 confirms the issue 100%

🎯 Bottom line

You’re mixing two environments:

Context	How to access env
Browser (React components)	import.meta.env.VITE_*
Server (React Router loader)	process.env.*

If you want, I can show you the cleanest setup for React Router + Vite + loaders so you never hit this again.

where should the .env file be?  in the public directory?
and i'm seeing "undefined" on that console.log line.

Short answer: No — it should NOT be in public/.

That’s exactly why you’re getting undefined.

📍 Correct location for .env

Your .env file must be in the project root, i.e. the same level as:

package.json
vite.config.js
node_modules/
✅ Correct structure:
friendly-dev/
├── .env          ✅ HERE
├── package.json
├── vite.config.js
├── node_modules/
├── src/
├── public/
❌ Wrong:
public/
└── .env          ❌ (will NOT be read)

The public/ folder is just for static assets—Vite and Node do not load env files from there.

🧠 Why you're seeing undefined

Right now:

console.log(process.env.VITE_API_URL);

→ undefined

That means:

Your .env file is either:
in the wrong place ❌
or not being loaded ❌
✅ Fix it step-by-step
1. Move .env to root

Put it here:

friendly-dev/.env
2. Add your variable (no quotes)
VITE_API_URL=http://localhost:8000
3. Load env for server-side (VERY IMPORTANT)

Since you're using a loader (server-side), add this:

import dotenv from "dotenv";
dotenv.config();

Put that at the top of your entry file (or even your loader file for now).

4. Restart dev server
npm run dev
5. Test again
console.log(process.env.VITE_API_URL);

You should now see:

http://localhost:8000
⚠️ One more subtle point (important)

Even though your variable is named:

VITE_API_URL

That naming is only required for client-side access via Vite.

For server-side (process.env), the prefix doesn’t matter.

👉 Best practice is actually:

VITE_API_URL=http://localhost:8000  # client
API_URL=http://localhost:8000       # server

Then:

Loader:
process.env.API_URL
Frontend:
import.meta.env.VITE_API_URL
🎯 Why this fixes everything
.env in root → Vite + dotenv can find it
dotenv.config() → Node can read it
Correct access method → no more undefined
No more "undefined/projects" error

If you want, I can help you cleanly wire this into your current React Router setup so you don’t need dotenv in every file.

yep,  better.  

Nice—that’s exactly the behavior we want 👍

Now that it’s working, here’s a clean, production-friendly setup so you don’t have to think about this again.

🧼 Clean setup (React Router + Vite + loaders)
1. Keep env separation clear
.env
VITE_API_URL=http://localhost:8000   # browser
API_URL=http://localhost:8000        # server (loaders)
2. Load env once, not everywhere

Instead of calling dotenv.config() in multiple files, do it once at app startup.

Example: server.js / entry point
import dotenv from "dotenv";
dotenv.config();

Now every loader can safely use:

process.env.API_URL
3. Create a tiny helper (recommended)

This avoids repeating process.env everywhere.

// lib/env.server.ts
export const API_URL = process.env.API_URL;

Then in your loader:

import { API_URL } from "~/lib/env.server";

export async function loader() {
  const res = await fetch(`${API_URL}/projects`);
  return res.json();
}
4. Add a guard (prevents silent bugs)

Catch issues early instead of getting undefined/projects again:

if (!process.env.API_URL) {
  throw new Error("API_URL is not defined");
}
5. Client-side stays separate

In React components:

const apiUrl = import.meta.env.VITE_API_URL;

👉 Never mix this with server code.

🧠 Mental model (this is the key takeaway)

Think of your app as two environments:

🟦 Browser (client)
Uses: import.meta.env.VITE_*
Built by Vite
Runs in user’s browser
🟩 Server (loaders)
Uses: process.env.*
Runs in Node
Needs dotenv
⚠️ One last pro tip

If you ever deploy (e.g., Vercel, Netlify):

Do NOT rely on .env in production
Set environment variables in the hosting platform instead
🚀 Where to go next (optional upgrades)

If you keep building this out, the next big improvements are:

Add request caching in loaders
Add retry/error handling for your API
Move to a central API client instead of raw fetch
Add type-safe env validation (e.g., Zod)

If you want, I can show you a really clean pattern for a shared API client that works across loaders + components without duplicating logic.

*/

