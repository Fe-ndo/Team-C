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
            <div className="w-full relative z-20 py-6 flex items-center justify-between">
                <h1 className="ml-4 font-bold items-start text-4xl">Fittrackr</h1>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <div className="pl-4 pr-4 py-1 flex justify-center flex-row rounded-full bg-slate-300 bg-opacity-70">
                        {Object.entries(navItems).map(([path, { name }]) => {
                        return (
                            <Link
                                key={path}
                                href={path}
                                className="font-bold transition-all flex align-middle py-1 px-2 m-1"
                                >
                                    {name}
                            </Link>
                            )
                            })}
                    </div>
                </div>
                <div className="mr-4 font-bold">
                    <button className="bg-slate-300 bg-opacity- rounded-md p-2 ">
                        <Link href="/Login" >Sign in</Link>
                    </button>
                </div>
            </div>
    )}