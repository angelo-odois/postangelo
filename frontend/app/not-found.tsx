import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Link
          href="/"
          className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
