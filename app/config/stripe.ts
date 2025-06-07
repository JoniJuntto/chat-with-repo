import Stripe from "stripe";
import { serverEnvs } from "../env/server";

const stripe = new Stripe(serverEnvs.STRIPE_SECRET_KEY);

export default stripe;
