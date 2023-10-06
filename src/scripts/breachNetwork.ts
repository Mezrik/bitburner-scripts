import { NS } from "@ns";
import { breach, evaluateNumberOfPortsBreachable } from "lib/security";
import { dfs } from "lib/graph";
import { checkRootFlag } from "lib/commandChecks";

/**
 * Script for used for searching servers that can be breached and granted root access to.
 */
export async function main(ns: NS): Promise<void> {
  const flags = ns.flags([
    ["root", "home"],
    ["script", false],
  ]);

  if (!checkRootFlag(ns, flags.root)) return;

  const ableToBreachNumPorts = evaluateNumberOfPortsBreachable(ns);

  const checkIfServerViable = (server: string) => {
    return (
      ns.hasRootAccess(server) ||
      ns.getServerNumPortsRequired(server) <= ableToBreachNumPorts
    );
  };

  const discovered = new Set<string>();

  dfs(ns, flags.root, discovered, checkIfServerViable);

  ns.tprint(`Found ${discovered.size} servers to breach.`);

  const initialScript =
    typeof flags.script === "string" && ns.fileExists(flags.script)
      ? flags.script
      : undefined;

  const initialScriptRamCost = initialScript
    ? ns.getScriptRam(initialScript)
    : null;

  let totalServersBreached = 0;

  // Breach discovered servers
  discovered.forEach((server) => {
    if (!ns.hasRootAccess(server)) {
      breach(ns, server);
      totalServersBreached += 1;
    }

    // Skip execution of initial script if it's not provided
    if (!initialScript) return;

    ns.killall(server);

    const serverUnusedRam =
      ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    const threads = Math.floor(serverUnusedRam / (initialScriptRamCost ?? 1));
    ns.print(server, threads);

    if (threads > 0) {
      ns.scp(initialScript, server);
      ns.exec(initialScript, server, threads);
    }
  });

  ns.tprint(
    `Breached ${totalServersBreached} servers. ${
      discovered.size - totalServersBreached
    } servers were already breached.`
  );
}
