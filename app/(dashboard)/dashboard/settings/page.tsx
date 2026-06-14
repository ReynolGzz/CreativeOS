import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Profile</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Name</label>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm">
              {session?.user?.name ?? "—"}
            </div>
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-1">Email</label>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-sm">
              {session?.user?.email ?? "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">API Keys</h2>
        <p className="text-zinc-400 text-sm">Configure your API keys in the <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-400">.env</code> file.</p>
        <div className="space-y-2">
          {["OPENAI_API_KEY", "UPLOADTHING_SECRET", "DATABASE_URL"].map((key) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-zinc-800">
              <code className="text-sm text-zinc-300">{key}</code>
              <span className="text-xs text-zinc-500">Set via environment</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
