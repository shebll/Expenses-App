import { getAssetFromKV } from "@cloudflare/kv-asset-handler";

addEventListener("fetch", (event) => {
  event.respondWith(handleEvent(event));
});

async function handleEvent(event) {
  try {
    // Try to serve static asset
    return await getAssetFromKV(event);
  } catch (e) {
    // If not a static asset, pass to your Worker logic
    return await handleRequest(event.request);
  }
}

async function handleRequest(request) {
  // Your existing Worker logic here
}
