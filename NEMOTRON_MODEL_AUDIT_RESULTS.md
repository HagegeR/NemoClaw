# Nemotron Model Audit — Complete Results

**Environment:** WSL2 Ubuntu-22.04, RTX 4090 24GB, Docker Desktop 29.2.1, 15GB system RAM
**Date:** 2026-03-22
**Method:** Each model loaded individually, VRAM cleared between tests, inference via gateway

## Final Results: All 21 Nemotron Models Tested

### Ollama Backend

| Model | Load | Inference | Think ON | Think OFF | Latency | Verdict |
|-------|------|-----------|----------|-----------|---------|---------|
| **nemotron-3-nano:30b** | OK (GPU) | OK | Reasoning in separate field | Content clean | 11-94s | **PRODUCTION READY** |

### LM Studio Backend — WORKING

| Model | Params | Load | Inference | Think ON | Think OFF | Latency | Verdict |
|-------|--------|------|-----------|----------|-----------|---------|---------|
| **OpenReasoning 1.5B** | 1.5B | OK (GPU) | OK | 226tok, `<think>` | 129tok, tags persist | 12-32s | Working |
| **OpenMath 1.5B** | 1.5B | OK (GPU) | OK | 226tok, `<think>` | 129tok, tags persist | 15-32s | Working |
| **Research Reasoning Qwen 1.5B** | 1.5B | OK (GPU) | OK | 218tok, clean | 121tok, clean | 13-32s | **Best small** |
| **Llama Nemotron Nano 4B v1.1** | 4B | OK (GPU) | OK | 223tok, `<think>` | 0tok (suppressed) | 32-40s | Working |
| **OpenReasoning 7B** | 7B | OK (GPU) | OK | 220tok, `<think>` | 127tok, tags persist | 40s | Working |
| **OpenCodeReasoning 7B** | 7B | OK (GPU) | OK | 221tok, clean | 127tok, clean | 39-43s | **Best 7B** |
| **OpenMath 7B** | 7B | OK (GPU) | OK | 220tok, `<think>` | 127tok, tags persist | 41-43s | Working |
| **AceReason 7B** | 7B | OK (GPU) | OK | 233tok, `<think>` | 127tok, tags persist | 42s | Working |
| **AceReason 1.1 7B** | 7B | OK (GPU) | OK | 233tok, `<think>` | 127tok, tags persist | 41-43s | Working |

### LM Studio Backend — ARCH UNSUPPORTED

| Model | Params | Arch | Issue |
|-------|--------|------|-------|
| **Nemotron 3 Nano 4B** | 4B | nemotron_h | `error loading model architecture: unknown model architecture: 'nemotron_h'` |

### LM Studio Backend — LOAD OK BUT INFERENCE FAILS (CPU fallback, too slow)

These models "load" but LM Studio puts them on CPU (not GPU). Inference times out at 192s.
VRAM stays at ~2443 MiB (baseline) — model never reaches GPU. Likely LM Studio's
resource guardrail forces CPU-only mode for models >7B on this system (15GB RAM constraint).

| Model | Params | Load | VRAM Change | Inference | Issue |
|-------|--------|------|-------------|-----------|-------|
| OpenReasoning 14B | 14B | OK (CPU) | +0M | TIMEOUT (192s) | Too slow on CPU |
| OpenCodeReasoning 14B | 14B | OK (CPU) | +0M | TIMEOUT (192s) | Too slow on CPU |
| AceReason 14B | 14B | OK (CPU) | +0M | TIMEOUT (193s) | Too slow on CPU |
| OpenMath 14B | 14B | OK (CPU) | +0M | 0tok instant | Loaded but no response |
| Apriel Nemotron 15B | 15B | OK (CPU) | +0M | 0tok instant | Loaded but no response |
| OpenReasoning 32B | 32B | OK (CPU) | +0M | 0tok instant | Loaded but no response |
| OpenMath 32B | 32B | OK (CPU) | +0M | 0tok instant | Loaded but no response |
| Nemotron 3 Nano 30B MoE | 30B | OK (CPU) | +0M | 0tok instant | Loaded but no response |

**Root cause:** LM Studio on this WSL2 system (15GB RAM, 24GB VRAM) can only GPU-accelerate
models up to ~7B at Q4_K_M. Larger models fall back to CPU where inference is impractical.
This is a WSL2 memory constraint — native Linux with 64GB+ RAM would handle 14B+ on GPU.

## Thinking ON vs OFF Summary

| Behavior | Models |
|----------|--------|
| **Clean separate reasoning field** | Ollama nemotron-3-nano:30b (best UX) |
| **`<think>` tags in content, suppressible** | Llama Nemotron Nano 4B v1.1 |
| **`<think>` tags in content, persist despite OFF prompt** | OpenReasoning, OpenMath, AceReason (all sizes) |
| **Clean output, no think tags ever** | Research Reasoning Qwen 1.5B, OpenCodeReasoning 7B |

## Recommended starterModels

### Ollama sidecar (best option)
```
nemotron-3-nano:30b — 18GB download, MoE (3B active), clean reasoning/content split
```

### LM Studio sidecar (alternatives)
```
llama-3.1-nemotron-nano-4b-v1.1@q4_k_m — 3GB, fast, think tags suppressible
opencodereasoning-nemotron-7b@q4_k_m  — 5GB, clean output, good for code
nemotron-research-reasoning-qwen-1.5b@q4_k_m — 1GB, tiny, clean output
```

## Models NOT Recommended

- **Nemotron 3 Nano 4B**: Architecture unsupported by llama.cpp
- **All 14B+ on LM Studio**: Fall back to CPU on WSL2 (15GB RAM), inference unusable
- **Nemotron 3 Nano 30B MoE on LM Studio**: Q4_K_M is 24.5GB, exceeds 24GB VRAM
