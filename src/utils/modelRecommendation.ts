// src/utils/modelRecommendation.ts
// -----------------------------------------------------------------------------
// Safely recommends the best local model (GPU or CPU) based on system capability.
// Includes strong fallback protection for Intel / Generic GPUs and missing f16.
// -----------------------------------------------------------------------------

// src/utils/modelRecommendation.ts
export function recommendModel(system: any) {
  const hasWebGPU = system.webgpu ?? false;
  const hasF16 = system.hasF16 ?? false;
  const gpuName = (system.gpuName || "unknown").toLowerCase();
  const deviceMemory = system.deviceMemory ?? 4;

  // Default safest CPU model
  let model = "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC";
  let note =
    "🧩 Low resource mode — using TinyLlama CPU-safe model for reliability.";

  // Intel / Weak GPU detection
  const isWeakGPU =
    /intel|uhd|iris|generic|hd|integrated|gfx/i.test(gpuName);

  // 🧠 Smart selection rules
  if (isWeakGPU || !hasWebGPU || !hasF16) {
    model = "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC";
    note =
      "⚙️ WebGPU or shader-f16 not supported — using TinyLlama CPU-safe model for stability.";
  } else if (hasWebGPU && hasF16 && deviceMemory >= 8) {
    model = "Phi-3-mini-4k-instruct-q4f16_1-MLC";
    note =
      "⚡ High-performance GPU detected — running Phi-3 Mini optimized for GPU (f16).";
  } else if (hasWebGPU && hasF16 && deviceMemory >= 4) {
    model = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
    note =
      "🚀 Mid-tier GPU detected — using Llama 3.2 1B (GPU-optimized).";
  }

  console.log("🧠 Model Recommendation:", { model, note, gpuName, hasF16 });
  return { model, note };
}
