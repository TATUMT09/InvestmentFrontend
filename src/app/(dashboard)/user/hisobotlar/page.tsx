import HisobotCard from "@/components/hisobot/HisobotCard";
import AiTahlilBlock from "@/components/hisobot/AiTahlilBlock";

export default function UserHisobotlarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>Hisobotlar</h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>Momolaringiz bo'yicha statistika va AI tahlili</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HisobotCard tur="kunlik"   jami={0} bajarildi={0} bajarilmadi={0} period="Bugun" />
        <HisobotCard tur="haftalik" jami={0} bajarildi={0} bajarilmadi={0} period="Bu hafta" />
        <HisobotCard tur="oylik"    jami={0} bajarildi={0} bajarilmadi={0} period="Bu oy" />
      </div>
      <AiTahlilBlock />
    </div>
  );
}
