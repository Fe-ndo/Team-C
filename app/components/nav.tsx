import Link from "next/link"


const navItems = {
    '/' : {
        name:'Home'
    },
    'Tools' : {
        name: 'Tools'
    },
    'Profile' : {
        name: 'Profile'
    }
}

const dropdownNavItems = {
    'WorkoutTrack' : {
        name:'WorkoutTrack'
    },
    'Search' : {
        name:'Search'
    },
    'CalorieTrack': {
        name:'CalorieTrack'
    }
}

export function NavBar() {
    return (
            <div className="py-5 flex items-center justify-between border-b border-slate-900/10 lg:hidden dark:border-slate-50/[0.1]">
                <h1 className="pl-4 font-bold justify-start text-4xl items-center">Fittrackr</h1>
                <div className=" px-4 py-1 flex flex-row rounded-full bg-slate-800">
                    {Object.entries(navItems).map(([path, { name }]) => {
                    return (
                        <Link
                            key={path}
                            href={path}
                            className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                            >
                                {name}
                        </Link>
                        )
                        })}
                </div>
                <div className="pr-4">
                    <Link href="/signin" >Sign in</Link>
                </div>
            </div>
    )}