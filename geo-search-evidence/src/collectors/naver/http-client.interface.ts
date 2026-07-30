import type { NaverSearchVolumeRequest } from "./types";

export interface NaverHttpClient {
  request(request: NaverSearchVolumeRequest): Promise<unknown>;
}
