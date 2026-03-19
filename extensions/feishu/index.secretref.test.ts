import { describe, expect, it, vi } from "vitest";
import { createTestPluginApi } from "../../test/helpers/extensions/plugin-api.js";
import { createPluginRuntimeMock } from "../../test/helpers/extensions/plugin-runtime-mock.js";
import plugin from "./index.js";

describe("feishu plugin register SecretRef regression", () => {
  it("registers tools without resolving SecretRefs", () => {
    const registerTool = vi.fn();

    expect(() =>
      plugin.register?.(
        createTestPluginApi({
          id: plugin.id,
          name: plugin.name,
          source: "extensions/feishu/index.ts",
          config: {
            channels: {
              feishu: {
                enabled: true,
                accounts: {
                  main: {
                    appId: "app-id",
                    appSecret: { source: "file", provider: "default", id: "path/to/app-secret" },
                    tools: {
                      chat: true,
                      doc: true,
                      drive: true,
                      perm: true,
                      wiki: true,
                    },
                  },
                },
              },
            },
          } as never,
          runtime: createPluginRuntimeMock(),
          registerTool,
        }),
      ),
    ).not.toThrow();

    expect(registerTool).toHaveBeenCalled();
  });
});
