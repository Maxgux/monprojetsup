import { type HttpClientOptions, type IHttpClient } from "./httpClient.interface";
import {
  CodeRéponseInattenduErreurHttp,
  ErreurInconnueErreurHttp,
  ErreurInterneServeurErreurHttp,
  NonAutoriséErreurHttp,
  NonIdentifiéErreurHttp,
  RequêteInvalideErreurHttp,
  RessourceNonTrouvéeErreurHttp,
  ServeurTemporairementIndisponibleErreurHttp,
} from "@/services/erreurs/erreursHttp";

export class HttpClient implements IHttpClient {
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
        if (response.status === 400) {
          return new RequêteInvalideErreurHttp(options);
        }

        if (response.status === 401) {
          return new NonIdentifiéErreurHttp(options);
        }

        if (response.status === 403) {
          return new NonAutoriséErreurHttp(options);
        }

        if (response.status === 404) {
          return new RessourceNonTrouvéeErreurHttp(options);
        }

        if (response.status === 503) {
          return new ServeurTemporairementIndisponibleErreurHttp(options);
        }

        if (response.status === 500) {
          return new ErreurInterneServeurErreurHttp(options);
        }

        return new CodeRéponseInattenduErreurHttp(options, response.status);
      }

      if (response.status === 204) return {} as O;
      return (await response.json()) as O;
    } catch (error) {
      return new ErreurInconnueErreurHttp({ ...options, error });
    }
  };
}
