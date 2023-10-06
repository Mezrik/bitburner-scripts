import { NS } from "@ns";
import { median } from "/lib/util";

/**
 * Upgrade all servers to max RAM. This script will end when all servers are upgraded.
 * @param ns {NS}
 */
export async function main(ns: NS): Promise<void> {
  const servers = new Set<string>(ns.getPurchasedServers());

  while (servers.size > 0) {
    const ramMedian = median(
      Array.from(servers).map((server) => ns.getServerMaxRam(server))
    );

    servers.forEach((server) => {
      if (ramMedian < ns.getServerMaxRam(server)) return;

      const ram = ns.getServerMaxRam(server) ** 2;

      // If the server is already maxed out, skip it
      if (ns.getPurchasedServerMaxRam() <= ram) {
        servers.delete(server);
        return;
      }

      if (
        ns.getPurchasedServerUpgradeCost(server, ram) <
        ns.getServerMoneyAvailable("home")
      )
        ns.upgradePurchasedServer(server, ram);
    });

    await ns.sleep(1000);
  }
}
