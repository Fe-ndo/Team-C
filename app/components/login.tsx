import Link from "next/link";

export function SignIn() {
    return (
        <div className="max-w-sm rounded-lg bg-gray-800 border-gray-700">
            <form className="space-y-6">
                <h5 className="text-xl font-medium te">Sign in to Fittrackr</h5>
                <div> 
                    <label className="block mb-2 text-sm"> Email</label>
                    <input className="rounded-lg w-full p-2.5 bg-gray-600 " ></input>
                </div>
                <div>
                    <label className="block ">Password</label>
                    <input></input>
                </div>
                <div className="flex">

                </div>
                <button>Login</button>
                <div>
                    <Link href={"#"}> Create account</Link>
                </div>
            </form>
        </div>
    )
}