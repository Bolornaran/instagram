import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 env:{
   HF_API_KEY :process.env.HF_API_KEY ?? ''
 }
};

export default nextConfig;
