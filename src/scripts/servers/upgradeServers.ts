import { NS } from "@ns";
import { median } from "/lib/util";

/**
 * Upgrade all servers to max RAM. This script will end when all servers are upgraded.
 * @param ns {NS}
 */
export async function main(ns: NS): Promise<void> {
  const flags = ns.flags([["spendPercent", 40]]);

  if (!flags.spendPercent || typeof flags.spendPercent !== "number") {
    ns.tprint("Invalid spend percentage provided.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} --spendPercent <percent>`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} --spendPercent 40`);

    return;
  }

  const moneyMultiplier = Math.min(flags.spendPercent, 100) / 100;

  const servers = new Set<string>(ns.getPurchasedServers());

  while (servers.size > 0) {
    const ramMedian = median(
      Array.from(servers).map((server) => ns.getServerMaxRam(server))
    );

    servers.forEach((server) => {
      if (ramMedian < ns.getServerMaxRam(server)) return;

      const ram = ns.getServerMaxRam(server) * 2;

      // If the server is already maxed out, skip it
      if (ns.getPurchasedServerMaxRam() <= ram) {
        servers.delete(server);
        return;
      }

      if (
        ns.getPurchasedServerUpgradeCost(server, ram) <
        ns.getServerMoneyAvailable("home") * moneyMultiplier
      )
        ns.upgradePurchasedServer(server, ram);
    });

    await ns.sleep(1000);
  }
}
