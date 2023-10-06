import { HackPrograms } from "types/common";

const portHacks: Record<"SSH" | "FTP" | "SMTP" | "HTTP" | "SQL", HackPrograms> =
  {
    SSH: {
      file: "BruteSSH.exe",
      command: "brutessh",
    },
    FTP: {
      file: "FTPCrack.exe",
      command: "ftpcrack",
    },
    SMTP: {
      file: "relaySMTP.exe",
      command: "relaysmtp",
    },
    HTTP: {
      file: "HTTPWorm.exe",
      command: "httpworm",
    },
    SQL: {
      file: "SQLInject.exe",
      command: "sqlinject",
    },
  };

export const nukeHack: HackPrograms = { file: "NUKE.exe", command: "nuke" };

export default portHacks;
