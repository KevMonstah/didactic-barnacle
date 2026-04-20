import { Outlet } from "react-router";
import type { Route } from '../about/+types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Your friendly neighborhood Dev" },
    { name: "description", content: "Kev's Custom Website Dev!" },
  ];
}

const MainLayout = () => {
    return (
        <>
            <section className='max-w-6xl mx-auto px-6 my-8'>
                <Outlet />
            </section>
        </>
    );
}

export default MainLayout;
