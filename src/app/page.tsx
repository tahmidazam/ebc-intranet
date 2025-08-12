import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <Link
        href="/admin/collections"
        className="underline underline-offset-4 decoration-border"
      >
        Admin
      </Link>
    </main>
  );
}
