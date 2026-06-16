"use client";
import { useRef, useState } from "react";
import Image from "next/image";

export default function ImageUploader({ onUpload, maxFiles=5 }: { onUpload:(f:File[])=>void; maxFiles?:number }) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: File[]) => {
    const limited = files.slice(0, maxFiles);
    setPreviews(limited.map(f => URL.createObjectURL(f)));
    onUpload(limited);
  };

  return (
    <div className="space-y-3">
      <div onClick={() => inputRef.current?.click()}
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);const f=Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith("image/"));if(f.length)handleFiles(f);}}
        className="flex flex-col items-center justify-center p-8 rounded-xl cursor-pointer transition-all"
        style={{
          border: `1.5px dashed ${dragging ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.1)"}`,
          background: dragging ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.02)",
        }}
        onMouseEnter={e=>(e.currentTarget.style.borderColor="rgba(59,130,246,0.3)")}
        onMouseLeave={e=>{if(!dragging) e.currentTarget.style.borderColor="rgba(255,255,255,0.1)";}}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3"
          style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)" }}>📷</div>
        <p className="text-sm font-semibold" style={{ color:"rgba(170,195,255,0.8)" }}>Rasm yuklash uchun bosing</p>
        <p className="text-xs mt-1" style={{ color:"rgba(100,130,200,0.45)" }}>yoki bu yerga tashlang · max {maxFiles} ta</p>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e=>{const f=Array.from(e.target.files||[]);if(f.length)handleFiles(f);}} />
      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {previews.map((src,i) => (
            <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group"
              style={{ border:"1px solid rgba(255,255,255,0.1)" }}>
              <Image src={src} alt={`preview-${i}`} fill className="object-cover" />
              <button type="button" onClick={()=>setPreviews(p=>p.filter((_,idx)=>idx!==i))}
                className="absolute inset-0 flex items-center justify-center text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background:"rgba(0,0,0,0.6)" }}>✕</button>
            </div>
          ))}
          {previews.length < maxFiles && (
            <button type="button" onClick={()=>inputRef.current?.click()}
              className="w-20 h-20 rounded-xl flex items-center justify-center text-xl transition-all"
              style={{ border:"1.5px dashed rgba(255,255,255,0.1)", color:"rgba(100,130,200,0.4)" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(59,130,246,0.3)"; e.currentTarget.style.color="rgba(96,165,250,0.6)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; e.currentTarget.style.color="rgba(100,130,200,0.4)";}}>
              +
            </button>
          )}
        </div>
      )}
    </div>
  );
}
