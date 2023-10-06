import { NS } from "@ns";

/**
 * Purchase the maximum of servers. This script will end when the maximum number of servers is reached
 * and will start the upgrade-servers script.
 *
 * @param ns {NS}
 * @returns {void}
 */
export async function main(ns: NS): Promise<void> {
  const ram = 8;

  let i = 0;

  while (i < ns.getPurchasedServerLimit()) {
    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
      ns.purchaseServer("pserv-" + i, ram);
      ++i;
    }

    await ns.sleep(1000);
  }
}
