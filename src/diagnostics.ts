// TEMP: diagnostics.ts
import axios from "axios";
import dns from "dns/promises";

export async function runDiagnostics() {
  try {
    console.log("\n--- Testing internet access ---");
    const internetRes = await axios.get("https://www.google.com");
    console.log("Internet access: OK", internetRes.status);

    console.log("\n--- Testing DNS resolution ---");
    const dnsRes = await dns.lookup("oauth2.googleapis.com");
    console.log("DNS resolved:", dnsRes);

    console.log("\n--- Testing oauth2.googleapis.com/token ---");
    await axios.post("https://oauth2.googleapis.com/token", {});
  } catch (err: any) {
    console.error("DIAGNOSTIC ERROR:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}
