import { NS } from "@ns";

/**
 * Calculate the number of threads needed for weaking the server to the minimum security level.
 *
 * @remarks
 * RAM cost: 1.2 GB
 *
 * @param ns {NS}
 * @param target - Hostname of the target server to weaken.
 * @returns The number of threads needed for weaking the server to the minimum security level.
 */
export function weakenThreads(ns: NS, target: string): number {
  const minSec = ns.getServerMinSecurityLevel(target);
  const sec = ns.getServerSecurityLevel(target);

  return Math.ceil((sec - minSec) / ns.weakenAnalyze(1));
}

/**
 * Calculate the number of threads needed for growing the server to the maximum money level.
 * (at current server security level)
 *
 * @remarks
 * RAM cost: 1.2 GB
 *
 * @param ns {NS}
 * @param target - Hostname of the target server to grow.
 * @returns The number of threads needed for growing the server to the maximum money level.
 */
export function growThreads(ns: NS, target: string): number {
  const maxMoney = ns.getServerMaxMoney(target);
  const money = ns.getServerMoneyAvailable(target);

  return Math.ceil(ns.growthAnalyze(target, maxMoney / money));
}

/**
 * Calculate the number of threads needed for growing the server to the maximum money level.
 * (at current server status)
 *
 * @remarks
 * RAM cost: 1.2 GB
 *
 * @param ns {NS}
 * @param target - Hostname of the target server to grow.
 * @returns The number of threads needed for growing the server to the maximum money level.
 */
export function hackThreads(ns: NS, target: string): number {
  return Math.ceil(1 / ns.hackAnalyze(target));
}
