import { NS, ScriptArg } from "@ns";

/**
 * @remarks RAM cost: 0 GB

 * @param ns {NS}
 * @param root The root flag - string pointing to a server
 * @returns True if the root flag is correct, false otherwise.
 */
export function checkRootFlag(
  ns: NS,
  root: string[] | ScriptArg
): root is string {
  if (typeof root !== "string") {
    ns.tprint(
      "Incorrect root flag. Please provide a name of a server you want to start the search from."
    );
    ns.tprint(`USAGE: run ${ns.getScriptName()} SERVER_NAME`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} home`);

    return false;
  }

  return true;
}

/**
 * @remarks RAM cost: 0 GB

 * @param ns {NS}
 * @param target The target arg - string pointing to a server
 * @returns True if the target arg is correct, false otherwise.
 */
export function checkTargetArg(
  ns: NS,
  target: string[] | ScriptArg
): target is string {
  if (!target || typeof target !== "string") {
    ns.tprint("No target provided.");
    ns.tprint(`USAGE: run ${ns.getScriptName()} TARGET`);
    ns.tprint("Example:");
    ns.tprint(`> run ${ns.getScriptName()} n00dles`);

    return false;
  }

  return true;
}
