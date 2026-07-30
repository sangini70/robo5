import crypto from "node:crypto";
import type { NaverHttpClient } from "./http-client.interface";
import type { NaverSearchVolumeRequest } from "./types";
import type { NaverRelatedKeywordRequest } from "./related.types";
import type { NaverAutocompleteRequest } from "./autocomplete.types";

function isAutocompleteRequest(
  request: NaverSearchVolumeRequest | NaverRelatedKeywordRequest | NaverAutocompleteRequest,
): request is NaverAutocompleteRequest {
  return request.path === "/nx/ac";
}

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
  async request(
    request: NaverSearchVolumeRequest | NaverRelatedKeywordRequest | NaverAutocompleteRequest,
  ): Promise<unknown> {
    if (isAutocompleteRequest(request)) {
      const url = new URL(request.path, "https://ac.search.naver.com");
      url.searchParams.set("q", request.query.q);
      url.searchParams.set("con", request.query.con);
      url.searchParams.set("frm", request.query.frm);
      url.searchParams.set("ans", request.query.ans);
      url.searchParams.set("r_format", request.query.r_format);
      url.searchParams.set("r_enc", request.query.r_enc);
      url.searchParams.set("r_unicode", request.query.r_unicode);
      url.searchParams.set("t_koreng", request.query.t_koreng);
      url.searchParams.set("st", request.query.st);
      url.searchParams.set("rev", request.query.rev);
      url.searchParams.set("q_enc", request.query.q_enc);

      const response = await fetch(url, {
        method: request.method,
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();
      let body: unknown = null;

      if (text.length > 0) {
        body = JSON.parse(text) as unknown;
      }

      if (!response.ok) {
        throw new Error(`NAVER autocomplete request failed with status ${response.status}`);
      }

      return body;
    }

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
