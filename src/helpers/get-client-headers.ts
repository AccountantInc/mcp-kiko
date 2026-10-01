import { getPackageVersion } from "./get-package-version.js";

export function getClientHeaders(): Record<string, string> {
    return {
        "User-Agent": `kikobooks-mcp-server/${getPackageVersion()}`,
    };
}
