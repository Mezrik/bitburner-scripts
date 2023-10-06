import { NS } from "@ns";
import { dfs } from "lib/graph";
import { checkRootFlag } from "lib/commandChecks";

export async function main(ns: NS): Promise<void> {
  const flags = ns.flags([["root", "home"]]);

  if (!checkRootFlag(ns, flags.root)) return;

  const myHackingLevel = ns.getHackingLevel();

  const toBackdoor = new Set<string>();

  // TODO: Check whether the server is mine or isn't already backdoored
  dfs(
    ns,
    flags.root,
    toBackdoor,
    (server: string) =>
      ns.hasRootAccess(server) &&
      myHackingLevel > ns.getServerRequiredHackingLevel(server)
  );
}
