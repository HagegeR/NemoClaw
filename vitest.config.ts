// SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//
// Coverage reporters required by davelosert/vitest-coverage-report-action (json-summary + json).
// reportOnFailure allows CI to publish a coverage comment when tests fail (see pr.yaml).
// Include only the TypeScript plugin sources so totals match ci/coverage-threshold.json (ratchet).

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "cli",
          include: ["test/**/*.test.js"],
          exclude: ["**/node_modules/**", "**/.claude/**"],
        },
      },
      {
        test: {
          name: "plugin",
          include: ["nemoclaw/src/**/*.test.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["nemoclaw/src/**/*.ts"],
      exclude: ["**/*.test.ts"],
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
    },
  },
});
