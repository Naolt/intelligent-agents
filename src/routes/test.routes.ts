import { Router, RequestHandler } from "express";
import axios from "axios";
import https from "https";
import { environment } from "@/config/environment";
import dns from "dns";
import fetch from "node-fetch";
const router = Router();

const fcmRestTest: RequestHandler = async (req, res) => {
  const serverKey = environment.FIREBASE_API_KEY;
  const testToken = "test-token"; // Replace with real one for actual delivery

  const payload = {
    notification: {
      title: "Test REST Notification",
      body: "REST API Firebase connection test",
    },
    to: testToken,
  };

  try {
    const response = await axios.post(
      "https://fcm.googleapis.com/fcm/send",
      payload,
      {
        headers: {
          Authorization: `key=${serverKey}`,
          "Content-Type": "application/json",
        },
        httpsAgent: new https.Agent({ family: 4 }), // Force IPv4
      }
    );

    res.status(200).json({
      status: "success",
      data: response.data,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "FCM REST call failed",
      error: {
        code: error.code || "unknown",
        message: error.message || "unknown error",
        details: error.response?.data || null,
      },
    });
  }
};

router.get("/fcm-rest-test", fcmRestTest);

const internetTest: RequestHandler = async (req, res, next) => {
  try {
    const testUrl = "https://jsonplaceholder.typicode.com/todos/1";

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    res.status(200).json({
      status: "success",
      message: "Successfully connected to external API",
      details: {
        url: testUrl,
        statusCode: response.status,
        data: data,
      },
    });
  } catch (error: any) {
    console.error("Internet connectivity test failed:", error);
    res.status(500).json({
      status: "error",
      message: "Internet connectivity test failed",
      error: {
        message: error.message || "Unknown error occurred",
      },
    });
  }
};

router.get("/internet-test", internetTest);

// Force IPv4 DNS resolution
dns.setDefaultResultOrder("ipv4first");

const connectivityDiagnostics: RequestHandler = async (req, res) => {
  const testUrl = req.query.url as string;

  if (!testUrl) {
    res.status(400).json({
      status: "error",
      message: "Missing 'url' query parameter",
    });
    return;
  }

  let hostname: string;
  try {
    const parsedUrl = new URL(testUrl);
    hostname = parsedUrl.hostname;
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "Invalid URL provided",
    });
    return;
  }

  try {
    // Step 1: DNS resolution
    const resolvedIPs = await new Promise<string[]>((resolve, reject) => {
      dns.resolve(hostname, (err, records) => {
        if (err) return reject(err);
        resolve(records);
      });
    });

    // Step 2: Test HTTPS request (GET)
    const response = await fetch(testUrl, {
      method: "GET",
      agent: new https.Agent({ family: 4 }), // IPv4 enforced
      headers: {
        Accept: "application/json",
      },
    });

    const body = await response.text();

    res.status(200).json({
      status: "success",
      targetURL: testUrl,
      resolvedIPs: resolvedIPs,
      httpStatus: response.status,
      responseBody: body,
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Connectivity check failed",
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
      },
    });
    return;
  }
};

router.get("/diagnostics", connectivityDiagnostics);

export default {
  path: "/test",
  router,
};
