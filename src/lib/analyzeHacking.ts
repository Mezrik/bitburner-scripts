import { NS, Server } from "@ns";
import { getAllServersInNetwork } from "lib/graph";
import {
  growScript,
  hackScript,
  weakenScript,
} from "/constants/hackScriptPaths";

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
  const money = ns.getServerMoneyAvailable(target) || 1;

  ns.tprint(target, maxMoney / money);
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
  return Math.ceil(0.98 / ns.hackAnalyze(target));
}

export function getHackScriptsRamCost(ns: NS): {
  weakenRamCost: number;
  growRamCost: number;
  hackRamCost: number;
} {
  const weakenRamCost = ns.getScriptRam(weakenScript);
  const growRamCost = ns.getScriptRam(growScript);
  const hackRamCost = ns.getScriptRam(hackScript);

  return { weakenRamCost, growRamCost, hackRamCost };
}

export function analyzeServerHackGainRate(ns: NS, target: string): number {
  const currentPlayer = ns.getPlayer();
  const { weakenRamCost, growRamCost, hackRamCost } = getHackScriptsRamCost(ns);

  const targetServer = ns.getServer(target);

  const weakenCost =
    weakenRamCost * ns.formulas.hacking.weakenTime(targetServer, currentPlayer);

  const growCost =
    growRamCost * ns.formulas.hacking.growTime(targetServer, currentPlayer) +
    (weakenCost * 0.004) / 0.05;

  const hackCost =
    hackRamCost * ns.formulas.hacking.hackTime(targetServer, currentPlayer) +
    (weakenCost * 0.002) / 0.05;

  // Lower difficulty to minimum before calculating grow gain
  targetServer.hackDifficulty = targetServer.minDifficulty;

  const growGain = Math.log(
    ns.formulas.hacking.growPercent(targetServer, 1, currentPlayer, 1)
  );

  // Maximize target money before calculating hack gain
  targetServer.moneyAvailable = targetServer.moneyMax;
  const hackGain = ns.formulas.hacking.hackPercent(targetServer, currentPlayer);

  const allServers = getAllServersInNetwork(ns);

  const estHackPercent = Math.min(
    0.98,
    Math.min(
      (allServers.ramAvailable * hackGain) / hackCost,
      1 - 1 / Math.exp((allServers.ramAvailable * growGain) / growCost)
    )
  );

  const growsPerCycle = -Math.log(1 - estHackPercent) / growGain;
  const hacksPerCycle = estHackPercent / hackGain;

  const hackProfit =
    (targetServer.moneyMax ?? 1) *
    estHackPercent *
    ns.formulas.hacking.hackChance(targetServer, currentPlayer);

  // Gain rate in money per second
  const theoreticalGainRate =
    (hackProfit / (growCost * growsPerCycle + hackCost * hacksPerCycle)) * 1000;

  return theoreticalGainRate;
}

/**
 * @param ns {NS}
 * @returns Returns a list of servers sorted by their relative momentary money gain rate per second.
 */
export function getAnalyzedServers(ns: NS): (Server & { gainRate: number })[] {
  return getAllServersInNetwork(ns)
    .allServers.map((server) => ({
      ...ns.getServer(server),
      gainRate: analyzeServerHackGainRate(ns, server),
    }))
    .filter(
      (server) =>
        !server.purchasedByPlayer &&
        (server.requiredHackingSkill ?? 0) <= ns.getHackingLevel()
    )
    .sort((a, b) => b.gainRate - a.gainRate);
}
