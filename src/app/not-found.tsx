import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <span className="text-6xl mb-4">🔍</span>
      <h1 className="text-3xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500 mt-2">Sahifa topilmadi</p>
      <Link href="/" className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Bosh sahifaga
      </Link>
    </div>
  );
}
