import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue">
                Ask Josh
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Your Property Maintenance
              <span className="block text-blue"> Assistant</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
              Get instant help with property maintenance questions, tips, and guidance from Josh.
            </p>
            <div className="flex justify-center">
              <Link
                href="/chat"
                className="rounded-lg bg-blue px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue/90 focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 sm:px-10 sm:py-5"
              >
                Chat with Josh
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
