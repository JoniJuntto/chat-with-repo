import { auth } from "@/auth";

export default async function Pricing() {
  const session = await auth();
  return (
    <div>
      <h1>Pricing</h1>
      <p>{session?.user?.email}</p>
      <form action="/api/checkout-sessions" method="POST">
        <button type="submit">Checkout</button>
      </form>
    </div>
  );
}
