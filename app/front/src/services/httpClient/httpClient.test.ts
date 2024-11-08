import { HttpClient } from "./httpClient";
import { type HttpClientOptions, IHttpClient } from "./httpClient.interface";
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

vi.mock("@/configuration/dépendances/dépendances", () => ({
  dépendances: {
    logger: {
      consigner: vi.fn(),
    },
  },
}));

describe("HttpClient", () => {
  let httpClient: IHttpClient;
  const ENDPOINT = "http://example.com/api";

  beforeEach(() => {
    httpClient = new HttpClient();
  });

  describe("récupérer", () => {
    test("doit renvoyer les données si tout s'est bien déroulé", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const responseData = { id: 1, name: "John Doe" };
      const response = new Response(JSON.stringify(responseData), { status: 200 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toEqual(responseData);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur RequêteInvalideErreurHttp et logger l'erreur si la requête a échouée avec un status 400", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const response = new Response(null, { status: 400 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(RequêteInvalideErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur NonIdentifiéErreurHttp et logger l'erreur si la requête a échouée avec un status 401", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const response = new Response(null, { status: 401 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(NonIdentifiéErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur NonAutoriséErreurHttp et logger l'erreur si la requête a échouée avec un status 403", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const response = new Response(null, { status: 403 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(NonAutoriséErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur RessourceNonTrouvéeErreurHttp et logger l'erreur si la requête a échouée avec un status 404", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const response = new Response(null, { status: 404 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(RessourceNonTrouvéeErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur ServeurTemporairementIndisponibleErreurHttp et logger l'erreur si la requête a échouée avec un status 503", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const response = new Response(null, { status: 503 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(ServeurTemporairementIndisponibleErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur ErreurInterneServeurErreurHttp et logger l'erreur si la requête a échouée avec un status 500", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const response = new Response(null, { status: 500 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(ErreurInterneServeurErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur CodeRéponseInattenduErreurHttp et logger l'erreur si la requête a échouée avec n'importe quel autre status !== ok", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const response = new Response(null, { status: 410 });
      vitest.spyOn(global, "fetch").mockResolvedValueOnce(response);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(CodeRéponseInattenduErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });

    test("doit renvoyer une erreur générique et logger l'erreur si une erreur survient", async () => {
      // GIVEN
      const options: HttpClientOptions = {
        endpoint: ENDPOINT,
        méthode: "GET",
      };
      const error = new Error("Network error");
      vitest.spyOn(global, "fetch").mockRejectedValueOnce(error);

      // WHEN
      const result = await httpClient.récupérer(options);

      // THEN
      expect(result).toBeInstanceOf(ErreurInconnueErreurHttp);
      expect(global.fetch).toHaveBeenCalledWith(options.endpoint, {
        method: options.méthode,
        body: undefined,
        headers: {
          "content-type": "application/json",
        },
      });
    });
  });
});
