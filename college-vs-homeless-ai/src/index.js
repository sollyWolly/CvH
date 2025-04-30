/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx) {
	  // Handle CORS preflight
	  if (request.method === "OPTIONS") {
		return new Response(null, {
		  status: 204,
		  headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		  },
		});
	  }
  
	  try {
		const contentType = request.headers.get("Content-Type") || "";
		if (!contentType.includes("application/json")) {
		  throw new Error("Expected application/json");
		}
  
		const body = await request.json();
		if (!body.prompt) {
		  throw new Error("Missing prompt in body");
		}
  
		const result = await env.AI.run(
		  "@cf/stabilityai/stable-diffusion-xl-base-1.0",
		  { prompt: body.prompt }
		);
  
		return new Response(result, {
		  headers: {
			"Content-Type": "image/png",
			"Access-Control-Allow-Origin": "*",
		  },
		});
	  } catch (e) {
		return new Response(`Error: ${e.message}`, {
		  status: 500,
		  headers: {
			"Access-Control-Allow-Origin": "*",
		  },
		});
	  }
	}
  };
  
  