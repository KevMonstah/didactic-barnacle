export type Project = {
    id: number;  // was string
    documentId: string;
    title: string;
    description: string;
    image: string;
    url: string;
    date: string;
    category: string;
    featured: boolean;
};

//export type PostMeta = {
export type Post = {
  id: number;  // was string
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  image: string;
};

export type BlogPostDetailsPageProps = {
  loaderData: {
    post: Post;
    //post: PostMeta;
    //postMeta: PostMeta;
    //markdown: string;
  };
};

export type PostFilterProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

export type LatestPostsProps = {
  posts: Post[];
  //posts: PostMeta[];
  limit?: number;
};

// generic array
export type StrapiResponse<T> = {
  data: T[];
};

// to match strapi
export type StrapiProject = {
  id: number;
  documentId: string;
  title: string;
  description: string;
  image?: { // optional, and is either a string and an object
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
  url: string;
  date: string;
  category: string;
  featured: boolean;
};

export type StrapiPost = {
  id: number;
  slug: string;
  Title: string;
  excerpt: string;
  date: string;
  body: string;
  image?: { // optional, and is either a string and an object
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
      medium?: { url: string };
      large?: { url: string };
    };
  };
};

