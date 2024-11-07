import { type HttpClientOptions, type IHttpClient } from "./httpClient.interface";
import {
  HttpGénériqueError,
  NonAutoriséError,
  NonIdentifiéError,
  NonTrouvéError,
  RequêteInvalideError,
  ServeurTemporairementIndisponibleError,
} from "@/services/errors/errors";
import { type ILogger } from "@/services/logger/logger.interface";

export class HttpClient implements IHttpClient {
  public constructor(private readonly _logger: ILogger) {}

  public récupérer = async <O extends object>(options: HttpClientOptions): Promise<O | Error> => {
    const { endpoint, méthode, body, contentType, headers } = options;

    try {
      const response = await fetch(endpoint, {
        method: méthode,
        body: JSON.stringify(body),
        headers: {
          "content-type": contentType ?? "application/json",
          ...headers,
        },
      });

      if (!response?.ok) {
        this._logger.error({ endpoint, méthode, body, status: response.status });
        if (response.status === 400) {
          return new RequêteInvalideError();
        }

        if (response.status === 401) {
          return new NonIdentifiéError();
        }

        if (response.status === 403) {
          return new NonAutoriséError();
        }

        if (response.status === 404) {
          return new NonTrouvéError();
        }

        if (response.status === 503) {
          return new ServeurTemporairementIndisponibleError();
        }

        return new HttpGénériqueError();
      }

      if (response.status === 204) return {} as O;
      return (await response.json()) as O;
    } catch (error) {
      this._logger.error({ endpoint, méthode, body, error });
      return new HttpGénériqueError();
    }
  };
}
