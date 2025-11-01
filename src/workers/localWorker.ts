// src/workers/localWorker.ts
// src/workers/localWorker.ts
let engine: any = null;
let initPromise: Promise<any> | null = null;

export async function initLocalModel(modelOverride?: string) {
  const webllm = await import("@mlc-ai/web-llm");

  if (typeof window === "undefined") {
    console.warn("SSR detected — skipping local model init.");
    return null;
  }

  if (initPromise) return initPromise;
  if (engine) return engine;

  initPromise = (async () => {
    console.log("🕵️ Initializing Local LLM (Safe Lazy Version)...");
    await new Promise((r) => setTimeout(r, 300));

    const SAFE_CPU_MODEL_ID = "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC";

    const ALL_MODELS = {
      "Phi-3-mini-4k-instruct-q4f16_1-MLC": {
        id: "Phi-3-mini-4k-instruct-q4f16_1-MLC",
        name: "Phi-3 Mini (GPU)",
      },
      "Llama-3.2-1B-Instruct-q4f16_1-MLC": {
        id: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
        name: "Llama 3.2 1B (GPU)",
      },
      "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC": {
        id: "TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC",
        name: "TinyLlama 1.1B (CPU)",
        config: {
          backend: "wasm",
          model_lib_url:
            "https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC/resolve/main/TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC-wasm.wasm",
        },
      },
      "Phi-3-mini-4k-instruct-q4f32_1-MLC": {
        id: "Phi-3-mini-4k-instruct-q4f32_1-MLC",
        name: "Phi-3 Mini (CPU)",
        config: {
          backend: "wasm",
          model_lib_url:
            "https://huggingface.co/mlc-ai/Phi-3-mini-4k-instruct-q4f32_1-MLC/resolve/main/Phi-3-mini-4k-instruct-q4f32_1-MLC-wasm.wasm",
        },
      },
    };

    let modelId = modelOverride || SAFE_CPU_MODEL_ID;
    let engineConfig: any = {
      initProgressCallback: (report: any) => {
        if (report.progress) {
          const pct = (report.progress * 100).toFixed(1);
          console.log(`📦 Loading ${pct}% | ${report.text}`);
        }
      },
    };

    try {
      const adapter = await Promise.race([
        navigator.gpu?.requestAdapter({ powerPreference: "high-performance" }),
        new Promise((_, rej) =>
          setTimeout(() => rej(new Error("GPU timeout")), 2000)
        ),
      ]);

      const gpuName = adapter?.name ?? "Unknown GPU";
      const hasF16 = adapter?.features?.has("shader-f16") ?? false;
      const isGoodGPU = /nvidia|amd|apple|rtx|m\d/i.test(gpuName);
      const isWeakGPU = /intel|uhd|iris|generic|hd|integrated|gfx/i.test(
        gpuName.toLowerCase()
      );

      if (isWeakGPU || !hasF16) {
        console.warn(`⚠️ Weak or f16-unsupported GPU (${gpuName}), forcing CPU model.`);
        modelId = SAFE_CPU_MODEL_ID;
      } else if (adapter && hasF16 && isGoodGPU) {
        modelId =
          (navigator as any).deviceMemory >= 8
            ? "Phi-3-mini-4k-instruct-q4f16_1-MLC"
            : "Llama-3.2-1B-Instruct-q4f16_1-MLC";
        console.log(`✅ GPU detected: ${gpuName}, using ${modelId}`);
      } else {
        console.warn(`⚙️ No reliable GPU — fallback to CPU-safe model.`);
        modelId = SAFE_CPU_MODEL_ID;
      }
    } catch (err: any) {
      console.warn("⚙️ GPU detection skipped:", err.message);
      modelId = SAFE_CPU_MODEL_ID;
    }

    const selected = ALL_MODELS[modelId];
    if (selected.config) {
      engineConfig.backend = selected.config.backend;
      engineConfig.model_lib_url = selected.config.model_lib_url;
    }

    try {
      const loaded = await webllm.CreateMLCEngine(modelId, engineConfig);
      console.log(`✅ Local model initialized: ${selected.name}`);
      engine = loaded;
      initPromise = null;
      return engine;
    } catch (err) {
      console.error(`💥 Model failed: ${modelId}`, err);
      console.warn("🔁 Attempting fallback: TinyLlama CPU model...");
      const fallback = ALL_MODELS[SAFE_CPU_MODEL_ID];
      const fallbackConfig = {
        initProgressCallback: engineConfig.initProgressCallback,
        backend: fallback.config.backend,
        model_lib_url: fallback.config.model_lib_url,
      };
      const loaded = await webllm.CreateMLCEngine(fallback.id, fallbackConfig);
      console.log(`✅ Fallback loaded: ${fallback.name}`);
      engine = loaded;
      initPromise = null;
      return engine;
    }
  })();

  return initPromise;
}

/**
 * 🧠 Enhanced Local Prompt System for GAURA AI
 * Keeps responses short, accurate, and business-focused.
 */
export async function runLocalLLM(prompt: string): Promise<string> {
  try {
    const webllm = await import("@mlc-ai/web-llm");
    const engine = await initLocalModel();
    if (!engine) throw new Error("Local model not initialized");

    console.log("💬 Running prompt through local model...");

    // ✅ If greeting, skip full prompt and return a friendly intro
    const normalized = prompt.trim().toLowerCase();
    if (["hi", "hello", "hey", "good morning", "good evening"].includes(normalized)) {
      return "Hi there! 👋 I’m Gaura Bot, your AI assistant from GAURA AI Solutions. How can I help you today?";
    }

    const SYSTEM_PROMPT = `
You are "Gaura Bot", the official AI assistant for GAURA AI Solutions.

Your purpose:
Provide clear, polite, and short answers about GAURA AI's services, products, and training programs.

Behavior:
1. Keep every reply under **3 sentences** — concise and professional.
2. Always stay on-topic: AI services, training, products, or partnerships.
3. If asked off-topic (e.g., politics, personal, entertainment, general trivia):
   respond: "I’m Gaura Bot, and I can only assist with GAURA AI services and training."
4. Speak warmly but never verbose.
5. Use these facts:
   - GAURA AI provides training in Machine Learning, Agentic AI, and LLMs from Scratch.
   - GAURA AI’s flagship product is a privacy-centric Teaching Assistance App.
   - Partner: BitTwoByte (AI & Data Solutions).
   - Contact: info@gauraai.com.
`;

    // ✅ Add few-shot examples to “anchor” brevity
    const FEW_SHOT_EXAMPLES = `
User: What does GAURA AI do?
Assistant: GAURA AI provides training in Machine Learning and builds AI chatbots for businesses.

User: Who is your partner?
Assistant: Our industry partner is BitTwoByte, a Data & AI Solutions provider.

User: What is your product?
Assistant: GAURA AI’s main product is a privacy-focused Teaching Assistance App.

User: How can I contact you?
Assistant: You can reach us at info@gauraai.com.

User: Tell me a joke.
Assistant: I’m Gaura Bot, and I only assist with GAURA AI services and training.
`;

    const fullPrompt = `
${SYSTEM_PROMPT}

${FEW_SHOT_EXAMPLES}

User: ${prompt}
Assistant:
`;

    const reply = await engine.chat.completions.create({
      messages: [{ role: "user", content: fullPrompt.trim() }],
      stream: false,
    });

    const output =
      reply?.choices?.[0]?.message?.content?.trim() ||
      "(⚠️ No response generated)";
    console.log("✅ Local reply:", output);
    return output;
  } catch (err) {
    console.error("⚠️ Local LLM run failed:", err);
    return "⚠️ Local model error.";
  }
}