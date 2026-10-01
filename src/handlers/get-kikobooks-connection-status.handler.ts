import { kikoBooksClient } from "../clients/kikobooks-client.js";
import { getConfig } from "../config.js";
import { ToolResponse } from "../types/tool-response.js";
import { formatError } from "../helpers/format-error.js";

/**
 * Reports connection state without ever revealing the API key or any token.
 * - disconnected: no credentials configured
 * - unauthenticated: credentials present but a token could not be obtained
 * - connected: a valid access token is available
 */
export async function getKikoBooksConnectionStatus(): Promise<ToolResponse<any>> {
    try {
        const hasCredentials = kikoBooksClient.hasCredentials();
        const connected = hasCredentials ? await kikoBooksClient.checkConnection() : false;
        const status = connected
            ? "connected"
            : hasCredentials
              ? "unauthenticated"
              : "disconnected";

        return {
            result: {
                status,
                connected,
                hasCredentials,
                baseUrl: getConfig().baseUrl,
            },
            isError: false,
            error: null,
        };
    } catch (error) {
        return { result: null, isError: true, error: formatError(error) };
    }
}
