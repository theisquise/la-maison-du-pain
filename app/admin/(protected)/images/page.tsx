"use client";

import { useEffect, useState, useRef } from "react";
import { ImageIcon, Upload, Trash2, Copy, Check, Loader2, X } from "lucide-react";

type ImageMeta = {
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  url: string;
};

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
  return (bytes / 1024).toFixed(0) + " Ko";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImageMeta | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    fetch("/api/admin/images")
      .then((r) => r.json())
      .then((d) => { setImages(d); setLoading(false); });
  }, []);

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadMsg("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/images", { method: "POST", body: form });
    const json = await res.json();
    if (res.ok) {
      setImages((prev) => [json, ...prev]);
      setUploadMsg("✅ Image uploadée !");
    } else {
      setUploadMsg("❌ " + (json.error ?? "Erreur"));
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  }

  async function handleDelete(filename: string) {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename }),
    });
    setImages((prev) => prev.filter((i) => i.filename !== filename));
    if (preview?.filename === filename) setPreview(null);
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <ImageIcon className="w-6 h-6 text-amber-400" /> Médiathèque
      </h1>

      {/* Zone d'upload */}
      <div
        ref={dropRef}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-amber-400 bg-amber-400/10"
            : "border-stone-600 hover:border-amber-500 hover:bg-stone-800/50"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileInput}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
            <p className="text-stone-400 text-sm">Upload en cours…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-stone-500" />
            <p className="text-white font-medium">Glisse une image ici</p>
            <p className="text-stone-400 text-sm">ou clique pour choisir un fichier</p>
            <p className="text-stone-500 text-xs mt-1">JPG, PNG, WEBP, GIF, SVG — max 10 Mo</p>
          </div>
        )}
      </div>

      {uploadMsg && (
        <p className="text-sm text-stone-300">{uploadMsg}</p>
      )}

      {/* Grille d'images */}
      {images.length === 0 ? (
        <div className="bg-stone-800 rounded-xl p-10 text-center">
          <ImageIcon className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <p className="text-stone-500">Aucune image uploadée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div
              key={img.filename}
              className="group bg-stone-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer"
              onClick={() => setPreview(img)}
            >
              <div className="aspect-square bg-stone-700 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-white text-xs font-medium truncate">{img.originalName}</p>
                <p className="text-stone-500 text-xs">{formatSize(img.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détail */}
      {preview && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-stone-900 rounded-2xl max-w-lg w-full p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold truncate">{preview.originalName}</p>
              <button onClick={() => setPreview(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-800 rounded-xl overflow-hidden max-h-64 flex items-center justify-center">
              <img
                src={preview.url}
                alt={preview.originalName}
                className="max-w-full max-h-64 object-contain"
              />
            </div>

            <div className="text-sm text-stone-400 space-y-1">
              <p>Taille : {formatSize(preview.size)}</p>
              <p>Uploadée le : {formatDate(preview.uploadedAt)}</p>
            </div>

            {/* URL copiable */}
            <div>
              <p className="text-stone-400 text-xs mb-1 font-medium uppercase tracking-wide">URL de l'image</p>
              <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-3 py-2">
                <p className="text-amber-400 text-xs font-mono flex-1 truncate">{preview.url}</p>
                <button
                  onClick={() => copyUrl(preview.url)}
                  className="shrink-0 text-stone-400 hover:text-white transition-colors"
                  title="Copier l'URL"
                >
                  {copiedUrl === preview.url ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {copiedUrl === preview.url && (
                <p className="text-green-400 text-xs mt-1">✅ URL copiée !</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(preview.filename)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
