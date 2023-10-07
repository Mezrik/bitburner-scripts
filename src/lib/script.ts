import { NS } from "@ns";
import { dfsFreeRam } from "lib/graph";

export function copyAndExec(
  ns: NS,
  target: string,
  script: string,
  threads = 1,
  ...args: (string | number | boolean)[]
): void {
  ns.scp(script, target);
  ns.exec(script, target, threads, ...args);
}

export async function distributeExecScript(
  ns: NS,
  target: string,
  script: string,
  scriptRamCost: number,
  threadsNeeded: number,
  delay = 2000,
  log?: boolean
): Promise<void> {
  const ramNeeded = scriptRamCost * threadsNeeded;
  if (log)
    ns.tprint(`Total RAM needed for ${script} ${target}: ${ramNeeded} GB`);

  const [servers, totalRamFound] = dfsFreeRam(ns, ramNeeded, ns.getHostname());
  let threads = threadsNeeded;

  if (log) ns.tprint(`Using servers: ${JSON.stringify(servers)}`);

  for (const server of servers) {
    // We don't want to run the script on the target server
    if (server.host === target) continue;

    if (threads <= 0) break;

    const availableUsedThreads = Math.min(
      Math.floor(server.free / scriptRamCost),
      threads
    );

    availableUsedThreads > 0 &&
      copyAndExec(ns, server.host, script, availableUsedThreads, target);

    threads -= availableUsedThreads;
  }

  await ns.sleep(delay);
}
