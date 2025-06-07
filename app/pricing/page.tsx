import { auth } from "@/auth";

const plan = {
  name: "Makkara Pro",
  price: "€4.90",
  description: "Unlock the full potential of Makkara",
  features: [
    "Full access to all features",
    "Premium support",
    "Regular updates",
    "No ads",
    "Priority access to new features",
  ],
};

export default async function Pricing() {
  const session = await auth();

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-red-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
            Makkara Pro
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Get access to all premium features with our simple subscription
            plan.
          </p>
        </div>

        <div className="mt-12">
          <div className="rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-200">
                  {plan.name}
                </h2>
                <p className="mt-4 text-lg text-gray-400">{plan.description}</p>
                <div className="mt-8">
                  <span className="text-5xl font-extrabold text-gray-200">
                    {plan.price}
                  </span>
                  <span className="text-xl font-medium text-gray-400">
                    /month
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <form action="/api/checkout-sessions" method="POST">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-500 px-6 py-4 text-center text-lg font-semibold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {session?.user && (
          <div className="mt-8 text-center text-sm text-gray-500">
            Logged in as: {session.user.email}
          </div>
        )}
      </div>
    </div>
  );
}
