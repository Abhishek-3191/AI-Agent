import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    // @ts-ignore
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white">
      
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <h1 className="text-xl font-bold">AI Agent Builder</h1>
        </div>

        <UserButton afterSignOutUrl="/" />
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-28">
        <h1 className="text-5xl font-extrabold tracking-tight text-white">
          Build <span className="text-blue-500">AI Agents</span>  
          <br /> That Think & Act
        </h1>

        <p className="mt-6 max-w-2xl text-zinc-400 text-lg">
          Create multi-agent AI systems with tool calling, orchestration,
          and real-time streaming chat — powered by OpenAI Agents SDK.
        </p>

        <div className="mt-10 flex gap-4 flex-wrap justify-center">
          <a
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </a>

          <a
            href="https://github.com/Abhishek-3191/AI-Agent"
            target="_blank"
            className="rounded-xl border border-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 py-6 text-center text-zinc-500 border-t border-zinc-800">
        Built with ❤️ by Abhishek Srivastava
      </footer>
    </main>
  );
}
