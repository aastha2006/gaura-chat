// src/utils/systemCheck.ts

export async function getSystemInfo() {
  const info: any = {
    browser: navigator.userAgent,
    deviceMemory: navigator.deviceMemory || 4,
    cpuCores: navigator.hardwareConcurrency || 4,
    platform: navigator.platform || "unknown",
    gpuName: "Unknown",
    webgpu: false,
    hasF16: false,
  };

  try {
    if ("gpu" in navigator) {
      const adapter = await Promise.race([
        navigator.gpu.requestAdapter({ powerPreference: "high-performance" }),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000)),
      ]);

      if (adapter) {
        info.webgpu = true;
        info.gpuName = adapter.name || "Generic GPU";

        // Detect shader-f16 (float16 support)
        if (adapter.features.has("shader-f16")) {
          info.hasF16 = true;
        }
      }
    }
  } catch (err) {
    console.warn("⚙️ GPU check failed or unavailable:", err);
  }

  // Add a performanceLevel classification for future use
  const mem = info.deviceMemory;
  if (mem >= 12) info.performanceLevel = "very-high";
  else if (mem >= 8) info.performanceLevel = "high";
  else if (mem >= 4) info.performanceLevel = "medium";
  else info.performanceLevel = "low";

  return info;
}


