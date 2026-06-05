import dotenv from 'dotenv';
import axios from 'axios';
import Stripe from 'stripe';
dotenv.config();

// Load all keys from .env
const config = {
  openai: { key: process.env.OPENAI_API_KEY },
  stripe: new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-01-01' }),
  sendgrid: { key: process.env.SENDGRID_API_KEY },
  twilio: { sid: process.env.TWILIO_ACCOUNT_SID, token: process.env.TWILIO_AUTH_TOKEN },
  mongodb: { uri: process.env.MONGODB_URI },
  google: { id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET }
};

// Universal API caller
export async function callExternalAPI(url: string, method: string = 'GET', headers: any = {}, body: any = null) {
  try {
    const res = await axios({ url, method, headers, data: body });
    return { success: true, data: res.data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// Get code snippet for integration
export function getIntegrationCode(name: string) {
  const snippets: Record<string, string> = {
    stripe: `
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function createPayment(amount: number) {
  return await stripe.paymentIntents.create({ amount: amount * 100, currency: 'usd' });
}`,
    mongodb: `
import mongoose from 'mongoose';
export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('Missing DB URI');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ DB Connected');
}`,
    sendgrid: `
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
export async function sendEmail(to: string, subj: string, text: string) {
  await sgMail.send({ to, from: 'you@example.com', subject: subj, text });
}`
  };
  return snippets[name] || '';
}

// Test if integration works
export async function testIntegration(type: string) {
  switch (type) {
    case 'stripe': return !!process.env.STRIPE_SECRET_KEY;
    case 'mongodb': return !!process.env.MONGODB_URI;
    case 'sendgrid': return !!process.env.SENDGRID_API_KEY;
    default: return false;
  }
}

export default config;
