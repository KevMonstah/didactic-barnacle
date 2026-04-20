import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    layout('./routes/layouts/home.tsx', [index("routes/home/index.tsx")]),
    layout('./routes/layouts/main.tsx', [
        route('about', './routes/about/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
        route('contact', './routes/contact/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
        route('projects', './routes/projects/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
        route('projects/:id', './routes/projects/details.tsx'),  // this instead of naming file [id].tsx
        route('blog', './routes/blog/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
        route('blog/:slug', './routes/blog/details.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
        route('*', './routes/errors/not-found.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
    ]),
    //index("routes/home/index.tsx"),
    //route('about', './routes/about/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
    //route('contact', './routes/contact/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
    //route('projects', './routes/projects/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
    //route('blog', './routes/blog/index.tsx'),  // even with file as index.tsx, it's still access as about cuz in folder about
] satisfies RouteConfig;
