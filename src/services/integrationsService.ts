import dotenv from 'dotenv';
import axios from 'axios';
import Stripe from 'stripe';
dotenv.config();

const config = {
  stripe: new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-01-01' }),
  sendgrid: process.env.SENDGRID_API_KEY,
  twilio: { sid: process.env.TWILIO_ACCOUNT_SID, token: process.env.TWILIO_AUTH_TOKEN },
  mongodb: { uri: process.env.MONGODB_URI }
};

export async function callExternalAPI(url: string, method: string = 'GET', headers: any = {}, body: any = null) {
  try {
    const res = await axios({ url, method, headers, data: body });
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export function getIntegrationCode(name: string) {
  const snippets: Record<string, string> = {
    stripe: `import Stripe from 'stripe'; const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); export async function pay(amt:number) { return stripe.paymentIntents.create({amount:amt*100,currency:'usd'}) }`,
    mongodb: `import mongoose from 'mongoose'; export async function connectDB() { await mongoose.connect(process.env.MONGODB_URI!); console.log('DB OK') }`
  };
  return snippets[name] || '';
}

export async function testIntegration(type: string) {
  switch (type) {
    case 'stripe': return !!process.env.STRIPE_SECRET_KEY;
    case 'mongodb': return !!process.env.MONGODB_URI;
    default: return false;
  }
}

export default config;