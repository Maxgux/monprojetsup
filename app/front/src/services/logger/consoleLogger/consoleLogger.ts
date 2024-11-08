/* eslint-disable no-console */
import { Logger } from "@/services/logger/logger.interface";

export class ConsoleLogger implements Logger {
  public consigner(
    niveau: "fatal" | "error" | "warning" | "log" | "info" | "debug",
    erreur: Error,
    contexte?: unknown,
  ) {
    console.log(niveau, contexte);
    console.error(erreur);
  }
}
