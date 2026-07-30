import crypto from "node:crypto";
import type { NaverHttpClient } from "./http-client.interface";
import type { NaverSearchVolumeRequest } from "./types";

function toSignature(timestamp: string, method: string, path: string, secretKey: string): string {
  const message = `${timestamp}.${method}.${path}`;
  return crypto.createHmac("sha256", secretKey).update(message).digest("base64");
}

function requireCredential(value: string | null, name: string): string {
  if (value === null || value.trim().length === 0) {
    throw new Error(`Missing required Naver credential: ${name}`);
  }

  return value;
}

export class FetchNaverHttpClient implements NaverHttpClient {
  async request(request: NaverSearchVolumeRequest): Promise<unknown> {
    const apiKey = requireCredential(request.apiKey, "NAVER_API_KEY");
    const secretKey = requireCredential(request.secretKey, "NAVER_SECRET_KEY");
    const customerId = requireCredential(request.customerId, "NAVER_CUSTOMER_ID");

    const url = new URL(request.path, "https://api.searchad.naver.com");
    url.searchParams.set("hintKeywords", request.query.hintKeywords);
    url.searchParams.set("showDetail", request.query.showDetail);

    const timestamp = Date.now().toString();
    const signature = toSignature(timestamp, request.method, request.path, secretKey);

    const response = await fetch(url, {
      method: request.method,
      headers: {
        Accept: "application/json",
        "X-API-KEY": apiKey,
        "X-Customer": customerId,
        "X-Signature": signature,
        "X-Timestamp": timestamp,
      },
    });

    const text = await response.text();
    let body: unknown = null;

    if (text.length > 0) {
      body = JSON.parse(text) as unknown;
    }

    if (!response.ok) {
      throw new Error(`NAVER Search Volume API request failed with status ${response.status}`);
    }

    return body;
  }
}
