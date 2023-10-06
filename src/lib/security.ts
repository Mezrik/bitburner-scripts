import { NS } from "@ns";
import portHacks, { nukeHack } from "/constants/portHacks";

/**
 * Grants root access to the server.
 *
 * @param ns {NS}
 * @param host Server that should be breached.
 */
export function breach(ns: NS, host: string): void {
  Object.values(portHacks).forEach((hack) => {
    const command = ns[hack.command] as (host: string) => void;
    if (ns.fileExists(hack.file) && typeof command === "function") {
      command(host);
    }
  });

  if (
    ns.fileExists(nukeHack.file) &&
    typeof ns[nukeHack.command] === "function"
  ) {
    (ns[nukeHack.command] as (host: string) => void)(host);
  }
}

/**
 * @param ns {NS}
 * @returns Returns the number of ports that can be breached.
 */
export function evaluateNumberOfPortsBreachable(ns: NS): number {
  return Object.values(portHacks).reduce((acc, hack) => {
    if (ns.fileExists(hack.file)) {
      return acc + 1;
    }
    return acc;
  }, 0);
}
