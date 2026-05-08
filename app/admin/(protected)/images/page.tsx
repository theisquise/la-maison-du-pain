"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  ImageIcon, Upload, Trash2, Copy, Check, Loader2, X,
  ZoomIn, ZoomOut, Maximize2, Crop,
} from "lucide-react";

type ImageMeta = {
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
  url: string;
};

type Ratio = "1:1" | "4:3" | "16:9" | "3:4" | "libre";
const RATIOS: { label: string; value: Ratio }[] = [
  { label: "Libre", value: "libre" },
  { label: "Carré 1:1", value: "1:1" },
  { label: "Paysage 4:3", value: "4:3" },
  { label: "Vidéo 16:9", value: "16:9" },
  { label: "Portrait 3:4", value: "3:4" },
];
const RATIO_VALUES: Record<Ratio, number> = {
  "libre": 3 / 4,
  "1:1": 1,
  "4:3": 3 / 4,
  "16:9": 9 / 16,
  "3:4": 4 / 3,
};
const PREVIEW_W = 380;

function formatSize(bytes: number) {
  if (bytes > 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " Mo";
  return (bytes / 1024).toFixed(0) + " Ko";
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<ImageMeta | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ─── Éditeur ────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [ratio, setRatio] = useState<Ratio>("1:1");
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgNatural, setImgNatural] = useState({ w: 1, h: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ mx: 0, my: 0, ox: 0, oy: 0 });
  const [saving, setSaving] = useState(false);

  const previewH = PREVIEW_W * RATIO_VALUES[ratio];

  // Ajuste le scale initial pour couvrir la boîte
  const fitScale = useCallback((natW: number, natH: number, r: Ratio) => {
    const boxH = PREVIEW_W * RATIO_VALUES[r];
    return Math.max(PREVIEW_W / natW, boxH / natH);
  }, []);

  function enterEdit() {
    const s = fitScale(imgNatural.w, imgNatural.h, ratio);
    setScale(s);
    setOffset({ x: 0, y: 0 });
    setEditMode(true);
  }

  function center() {
    setOffset({ x: 0, y: 0 });
  }

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
  }

  // Drag to pan
  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    setIsPanning(true);
    setPanStart({ mx: e.clientX, my: e.clientY, ox: offset.x, oy: offset.y });
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isPanning) return;
    setOffset({
      x: panStart.ox + (e.clientX - panStart.mx),
      y: panStart.oy + (e.clientY - panStart.my),
    });
  }
  function onMouseUp() { setIsPanning(false); }

  // Touch support
  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    setIsPanning(true);
    setPanStart({ mx: t.clientX, my: t.clientY, ox: offset.x, oy: offset.y });
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!isPanning) return;
    const t = e.touches[0];
    setOffset({
      x: panStart.ox + (t.clientX - panStart.mx),
      y: panStart.oy + (t.clientY - panStart.my),
    });
  }

  // Save cropped image
  async function saveCrop() {
    if (!preview) return;
    setSaving(true);
    try {
      const OUTPUT_W = 1200;
      const OUTPUT_H = Math.round(OUTPUT_W * RATIO_VALUES[ratio]);
      const scaleRatio = OUTPUT_W / PREVIEW_W;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = preview.url;
      await new Promise<void>((res) => { img.onload = () => res(); });

      const canvas = document.createElement("canvas");
      canvas.width = OUTPUT_W;
      canvas.height = OUTPUT_H;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(0, 0, OUTPUT_W, OUTPUT_H);

      const dispW = img.naturalWidth * scale;
      const dispH = img.naturalHeight * scale;
      ctx.drawImage(
        img,
        OUTPUT_W / 2 - (dispW * scaleRatio) / 2 + offset.x * scaleRatio,
        OUTPUT_H / 2 - (dispH * scaleRatio) / 2 + offset.y * scaleRatio,
        dispW * scaleRatio,
        dispH * scaleRatio
      );

      await new Promise<void>((res) => {
        canvas.toBlob(async (blob) => {
          if (!blob) { res(); return; }
          const ext = preview.originalName.match(/\.[a-z]+$/i)?.[0] ?? ".jpg";
          const newName = preview.originalName.replace(/\.[a-z]+$/i, "") + `-${ratio.replace(":", "x")}${ext}`;
          const form = new FormData();
          form.append("file", blob, newName);
          const r = await fetch("/api/admin/images", { method: "POST", body: form });
          const json = await r.json();
          if (r.ok) {
            setImages((prev) => [json, ...prev]);
            setPreview(json);
            setEditMode(false);
          }
          res();
        }, "image/jpeg", 0.92);
      });
    } finally {
      setSaving(false);
    }
  }

  // ─── Upload ────────────────────────────────────────────────
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

  function openPreview(img: ImageMeta) {
    setPreview(img);
    setEditMode(false);
    setRatio("1:1");
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
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); }}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          dragging ? "border-amber-400 bg-amber-400/10" : "border-stone-600 hover:border-amber-500 hover:bg-stone-800/50"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
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
      {uploadMsg && <p className="text-sm text-stone-300">{uploadMsg}</p>}

      {/* Grille */}
      {images.length === 0 ? (
        <div className="bg-stone-800 rounded-xl p-10 text-center">
          <ImageIcon className="w-10 h-10 text-stone-600 mx-auto mb-3" />
          <p className="text-stone-500">Aucune image uploadée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.filename} className="group bg-stone-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-amber-500 transition-all cursor-pointer" onClick={() => openPreview(img)}>
              <div className="aspect-square bg-stone-700 overflow-hidden">
                <img src={img.url} alt={img.originalName} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className="text-white text-xs font-medium truncate">{img.originalName}</p>
                <p className="text-stone-500 text-xs">{formatSize(img.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Modal ─────────────────────────────────────────── */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => { setPreview(null); setEditMode(false); }}>
          <div className="bg-stone-900 rounded-2xl w-full max-w-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>

            {/* En-tête */}
            <div className="flex items-center justify-between">
              <p className="text-white font-semibold truncate flex-1">{preview.originalName}</p>
              <div className="flex items-center gap-2">
                {!editMode && (
                  <button onClick={enterEdit} className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
                    <Crop className="w-3.5 h-3.5" /> Recadrer
                  </button>
                )}
                <button onClick={() => { setPreview(null); setEditMode(false); }} className="text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ─── Mode édition ─── */}
            {editMode ? (
              <div className="space-y-4">
                {/* Sélecteur de ratio */}
                <div className="flex flex-wrap gap-1.5">
                  {RATIOS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => {
                        setRatio(r.value);
                        const s = fitScale(imgNatural.w, imgNatural.h, r.value);
                        setScale(s);
                        setOffset({ x: 0, y: 0 });
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        ratio === r.value ? "bg-amber-600 text-white" : "bg-stone-700 text-stone-300 hover:bg-stone-600"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                {/* Zone de prévisualisation / recadrage */}
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="relative overflow-hidden rounded-lg bg-stone-800 select-none"
                    style={{ width: PREVIEW_W, height: previewH, cursor: isPanning ? "grabbing" : "grab" }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={() => setIsPanning(false)}
                  >
                    {/* Grille de référence */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                      backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
                      backgroundSize: `${PREVIEW_W / 3}px ${previewH / 3}px`,
                    }} />
                    {/* Image */}
                    <img
                      src={preview.url}
                      alt=""
                      onLoad={onImgLoad}
                      draggable={false}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                        transformOrigin: "center",
                        maxWidth: "none",
                        userSelect: "none",
                      }}
                    />
                    {/* Règle des tiers */}
                    <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-lg">
                      <div className="absolute inset-0" style={{ borderRight: `1px solid rgba(255,255,255,.15)`, width: "33.3%" }} />
                      <div className="absolute inset-0" style={{ borderRight: `1px solid rgba(255,255,255,.15)`, width: "66.6%" }} />
                      <div className="absolute inset-x-0 border-b border-white/15" style={{ top: "33.3%" }} />
                      <div className="absolute inset-x-0 border-b border-white/15" style={{ top: "66.6%" }} />
                    </div>
                  </div>

                  {/* Zoom slider */}
                  <div className="flex items-center gap-3 w-full">
                    <button onClick={() => setScale((s) => Math.max(0.1, s - 0.1))} className="text-stone-400 hover:text-white">
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.05"
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <button onClick={() => setScale((s) => Math.min(3, s + 0.1))} className="text-stone-400 hover:text-white">
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <span className="text-stone-400 text-xs w-10 text-right">{Math.round(scale * 100)}%</span>
                  </div>
                </div>

                <p className="text-stone-500 text-xs text-center">
                  Glisse l'image pour repositionner · Zoom avec le curseur
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={center}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Maximize2 className="w-4 h-4" /> Centrer
                  </button>
                  <button
                    onClick={() => { setEditMode(false); }}
                    className="px-3 py-2.5 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg text-sm transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={saveCrop}
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? "Sauvegarde…" : "Sauvegarder"}
                  </button>
                </div>
              </div>
            ) : (
              /* ─── Mode détail ─── */
              <div className="space-y-4">
                <div className="bg-stone-800 rounded-xl overflow-hidden max-h-64 flex items-center justify-center">
                  <img src={preview.url} alt={preview.originalName} onLoad={onImgLoad} className="max-w-full max-h-64 object-contain" />
                </div>

                <div className="text-sm text-stone-400 space-y-1">
                  <p>Taille : {formatSize(preview.size)} · {imgNatural.w > 1 ? `${imgNatural.w}×${imgNatural.h}px` : ""}</p>
                  <p>Uploadée le : {formatDate(preview.uploadedAt)}</p>
                </div>

                <div>
                  <p className="text-stone-400 text-xs mb-1 font-medium uppercase tracking-wide">URL de l'image</p>
                  <div className="flex items-center gap-2 bg-stone-800 rounded-lg px-3 py-2">
                    <p className="text-amber-400 text-xs font-mono flex-1 truncate">{preview.url}</p>
                    <button onClick={() => copyUrl(preview.url)} className="shrink-0 text-stone-400 hover:text-white transition-colors">
                      {copiedUrl === preview.url ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  {copiedUrl === preview.url && <p className="text-green-400 text-xs mt-1">✅ URL copiée !</p>}
                </div>

                <div className="flex justify-end">
                  <button onClick={() => handleDelete(preview.filename)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" /> Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
