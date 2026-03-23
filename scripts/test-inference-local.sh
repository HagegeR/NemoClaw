#!/usr/bin/env bash
# SPDX-FileCopyrightText: Copyright (c) 2026 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
# SPDX-License-Identifier: Apache-2.0

# Test inference.local routing through OpenShell provider (local vLLM)
echo '{"model":"nvidia/nemotron-3-nano-30b-a3b","messages":[{"role":"user","content":"say hello"}]}' > /tmp/req.json
curl -s https://inference.local/v1/chat/completions -H "Content-Type: application/json" -d @/tmp/req.json
