"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  BookOpen,
  BrainCircuit,
  FileText,
  Gamepad2,
  Paperclip,
  Bot,
  User,
  History,
  X,
  FileUp,
  Loader2,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";

// ==============================
// CONFIGURATION
// ==============================
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 3;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const MIME_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "image/jpeg": "Image",
  "image/jpg": "Image",
  "image/png": "Image",
  "image/webp": "Image",
};

// ==============================
// TYPES
// ==============================
interface Message {
  role: "ai" | "user";
  content: string;
  isError?: boolean;
}

// ==============================
// UTILITAIRES
// ==============================
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return `"${file.name}" dépasse 10 MB (${formatFileSize(file.size)})`;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return `"${file.name}" n'est pas un type supporté (PDF, JPG, PNG uniquement)`;
  }

  return null;
};

// ==============================
// COMPOSANT PRINCIPAL
// ==============================
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Salut ! Je suis ton tuteur IA. Dépose tes fichiers (PDF, Images max 10MB) ici pour commencer la révision !",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==============================
  // AUTO-SCROLL
  // ==============================
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  // ==============================
  // COPIE DE MESSAGE
  // ==============================
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ==============================
  // DRAG & DROP
  // ==============================
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  // ==============================
  // TRAITEMENT DES FICHIERS
  // ==============================
  const processFiles = (files: File[]) => {
    const errors: string[] = [];
    const validFiles: File[] = [];

    // Validation individuelle
    files.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    // Vérification du nombre total
    const totalFiles = attachedFiles.length + validFiles.length;
    if (totalFiles > MAX_FILES) {
      errors.push(
        `Maximum ${MAX_FILES} fichiers autorisés (${attachedFiles.length} déjà ajouté${attachedFiles.length > 1 ? "s" : ""})`,
      );
      const allowedCount = MAX_FILES - attachedFiles.length;
      validFiles.splice(allowedCount);
    }

    // Affichage des erreurs
    if (errors.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: `⚠️ **Fichiers rejetés :**\n${errors.map((e) => `• ${e}`).join("\n")}`,
          isError: true,
        },
      ]);
    }

    // Ajout des fichiers valides
    if (validFiles.length > 0) {
      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
    // Reset l'input pour permettre de rajouter le même fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==============================
  // SUPPRESSION DE FICHIER
  // ==============================
  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ==============================
  // ENVOI DU MESSAGE
  // ==============================
  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputValue;
    if (!promptToSend.trim() && attachedFiles.length === 0) return;

    // Message utilisateur
    const userMessage = promptToSend.trim() || "Analyse de documents...";
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setInputValue("");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("prompt", promptToSend);
    attachedFiles.forEach((file) => formData.append("files", file));

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Erreur serveur");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.text || "Aucune réponse générée.",
        },
      ]);

      // Reset des fichiers après succès
      setAttachedFiles([]);
    } catch (error: any) {
      console.error("Erreur lors de l'envoi:", error);

      let errorMessage = "Une erreur s'est produite.";

      if (error.message.includes("fetch")) {
        errorMessage =
          "🌐 Problème de connexion. Vérifie ton internet et réessaie.";
      } else if (
        error.message.includes("quota") ||
        error.message.includes("rate")
      ) {
        errorMessage =
          "⏱️ Trop de requêtes. Patiente quelques secondes et réessaie.";
      } else if (
        error.message.includes("trop de temps") ||
        error.message.includes("timeout")
      ) {
        errorMessage =
          "⏳ Le traitement a pris trop de temps. Essaie avec des fichiers plus légers.";
      } else {
        errorMessage = `❌ ${error.message}`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================
  // ACTIONS RAPIDES
  // ==============================
  const actions = [
    {
      title: "Résumer",
      icon: <FileText size={14} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      prompt: "Résume ce document de manière structurée avec les points clés.",
    },
    {
      title: "Quiz",
      icon: <Gamepad2 size={14} />,
      color: "text-purple-600",
      bg: "bg-purple-50",
      prompt: "Génère un quiz de 5 questions avec leurs réponses sur ce cours.",
    },
    {
      title: "Réviser",
      icon: <BrainCircuit size={14} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      prompt: "Fais-moi un plan de révision détaillé pour ce sujet.",
    },
    {
      title: "Expliquer",
      icon: <BookOpen size={14} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      prompt: "Explique-moi ce concept de manière simple avec des exemples.",
    },
  ];

  // ==============================
  // RENDU
  // ==============================
  return (
    <div
      className={`relative flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto overflow-hidden transition-colors ${
        isDragging ? "bg-blue-50/50" : "bg-transparent"
      }`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      {/* Overlay Drag & Drop */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-600/10 backdrop-blur-sm pointer-events-none border-4 border-dashed border-blue-400 m-4 rounded-[2rem]">
          <div className="flex flex-col items-center gap-2">
            <FileUp size={48} className="text-blue-600 animate-bounce" />
            <p className="text-xl font-black text-blue-600 uppercase tracking-tight">
              Dépose tes fichiers ici
            </p>
            <p className="text-xs font-bold text-blue-500">
              PDF, JPG, PNG • Max {MAX_FILES} fichiers • 10 MB chacun
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 shrink-0 bg-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">
              Assistant IA
            </h1>
            <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Gemini Flash 3
            </p>
          </div>
        </div>
        <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-400 transition-all border border-transparent hover:border-slate-100">
          <History size={20} />
        </button>
      </div>

      {/* Zone des Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 space-y-6 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "ai" ? "justify-start" : "justify-end"
            } group animate-in fade-in slide-in-from-bottom-3`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                msg.role === "ai" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                  msg.role === "ai"
                    ? msg.isError
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-white text-blue-600 border-slate-100"
                    : "bg-slate-900 text-white border-slate-900"
                }`}
              >
                {msg.role === "ai" ? (
                  msg.isError ? (
                    <AlertCircle size={16} />
                  ) : (
                    <Bot size={16} />
                  )
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="relative group/content">
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                    msg.role === "ai"
                      ? msg.isError
                        ? "bg-red-50 border border-red-100 text-red-700"
                        : "bg-white border border-slate-100 text-slate-700"
                      : "bg-blue-600 text-white font-medium"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Bouton Copier */}
                {!msg.isError && (
                  <button
                    onClick={() => handleCopy(msg.content, i)}
                    className={`absolute top-2 ${
                      msg.role === "ai" ? "-right-10" : "-left-10"
                    } p-2 rounded-lg opacity-0 group-hover/content:opacity-100 transition-opacity bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600`}
                    title="Copier le message"
                  >
                    {copiedIndex === i ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loader */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-blue-600">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                L'IA analyse...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Zone de Saisie */}
      <div className="p-6 shrink-0">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-3 shadow-xl shadow-slate-200/40">
          {/* Fichiers Attachés */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 px-3">
              {attachedFiles.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-blue-50/50 pl-3 pr-1.5 py-1.5 rounded-full border border-blue-100 group"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-blue-700 truncate max-w-37.5">
                      {f.name}
                    </span>
                    <span className="text-[8px] text-blue-500">
                      {MIME_TYPE_LABELS[f.type] || "Fichier"} •{" "}
                      {formatFileSize(f.size)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 hover:bg-blue-100 text-blue-400 rounded-full transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions Rapides */}
          {attachedFiles.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide px-2 no-scrollbar">
              {actions.map((act, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(act.prompt)}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full shrink-0 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 ${act.bg} ${act.color}`}
                >
                  {act.icon}
                  <span className="text-[10px] font-black uppercase tracking-wide">
                    {act.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="relative flex items-center bg-slate-50/50 rounded-4xl border border-slate-100 focus-within:bg-white focus-within:border-blue-200 focus-within:shadow-inner transition-all p-1.5">
            <label className="p-3 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_TYPES.join(",")}
                className="hidden"
                onChange={handleFileInput}
                disabled={isLoading}
              />
              <Paperclip size={20} />
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              placeholder="Pose ta question ou glisse un cours..."
              className="flex-1 bg-transparent py-3 text-sm outline-none px-2 text-slate-700 placeholder:text-slate-400"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={
                isLoading || (!inputValue.trim() && attachedFiles.length === 0)
              }
              className="bg-blue-600 text-white p-3 rounded-3xl hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-md shadow-blue-200 disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 mt-4">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            IA Scolaire v1.0
          </p>
          <div className="flex gap-4">
            <span className="text-[9px] text-slate-300 font-medium cursor-pointer hover:text-slate-400">
              Confidentialité
            </span>
            <span className="text-[9px] text-slate-300 font-medium cursor-pointer hover:text-slate-400">
              Aide
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
