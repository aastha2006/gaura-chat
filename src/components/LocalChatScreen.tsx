import { useEffect, useState } from "react";
import { ChatArea } from "./ChatArea";
import { ChatInput } from "./ChatInput";
import { useChat } from "@/hooks/useChat";
import { getSystemInfo } from "@/utils/systemCheck";
import { recommendModel } from "@/utils/modelRecommendation";
import { initLocalModel } from "@/workers/localworker"; // ✅ added import
import { Shield, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LocalChatScreen() {
  const { messages, sendMessage, isTyping, setMode } = useChat();
  const [system, setSystem] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState<string>("Initializing...");
  const [isModelReady, setIsModelReady] = useState(false);

  // Force mode to local
  useEffect(() => {
    setMode("local");
  }, [setMode]);

  // Get system details once and initialize local model
  useEffect(() => {
    async function checkSystem() {
      const sys = await getSystemInfo();
      const rec = recommendModel(sys);
      setSystem(sys);
      setRecommendation(rec);

      console.log("🧠 System Info:", sys);
      console.log("🎯 Recommendation:", rec);

      // ✅ initialize model
      try {
        setLoadingProgress("⏳ Loading local model...");
        const engine = await initLocalModel(rec.model);
        console.log("✅ Local model initialized:", engine);
        setIsModelReady(true);
        setLoadingProgress("✅ Model ready for chat!");
      } catch (err) {
        console.error("💥 Local model init failed:", err);
        setLoadingProgress("❌ Failed to load local model.");
      }
    }

    checkSystem();
  }, []);

  return (
    <div className="flex flex-col h-full w-full">
      <div
        className="text-white px-4 py-2 flex-shrink-0 border-b border-indigo-400/30 shadow-sm"
        style={{ backgroundColor: "#4f46e5" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Shield size={14} className="opacity-90" />
            <span className="font-medium">Private Mode Active</span>
            <span className="hidden sm:inline opacity-80">
              • All processing happens locally
            </span>
          </div>

          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="ml-2 text-xs sm:text-sm text-white/90 hover:text-white transition flex items-center gap-1"
          >
            {showDetails ? (
              <>
                Hide Details <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show Details <ChevronDown size={14} />
              </>
            )}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {showDetails && system && recommendation && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-1"
            >
              <div
                className="flex flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm opacity-90 leading-tight justify-start sm:justify-between"
                style={{ color: "white" }}
              >
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span>• OS: {system.os || "Unknown"}</span>
                  <span>• CPU: {system.cpuCores || "?"} cores</span>
                  <span>• RAM: {system.deviceMemory || "?"} GB</span>
                  <span>• GPU: {system.gpuName || "Unknown"}</span>
                </div>

                <div className="flex flex-wrap gap-x-2">
                  <span className="ml-1">
                    ⚡ <strong>{recommendation.model.split("-Chat")[0]}</strong>
                  </span>
                  <span className="opacity-75">
                    ({system.webgpu ? "WebGPU" : "WASM"})
                  </span>
                </div>
              </div>

              {/* ✅ Added loading progress below system info */}
              <div className="text-xs sm:text-sm mt-1 opacity-80" style={{ color: "white" }}>
                {loadingProgress}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-y-auto">
        {isModelReady ? (
          <ChatArea messages={messages} isLoading={isTyping} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            {loadingProgress}
          </div>
        )}
      </div>

      <ChatInput
        onSend={sendMessage}
        disabled={isTyping || !isModelReady}
        placeholder={
          isModelReady
            ? "Type your message (processed locally)..."
            : "Please wait, loading local model..."
        }
      />
    </div>
  );
}
