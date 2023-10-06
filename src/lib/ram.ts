import { NS } from "@ns";

/**
 * Get the amount of free RAM on a server
 * @param ns {NS}
 * @param host The server hostname
 * @returns The amount of free RAM on a server
 */
export function getFreeRam(ns: NS, host: string): number {
  return ns.getServerMaxRam(host) - ns.getServerUsedRam(host);
}
