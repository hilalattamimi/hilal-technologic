import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-2xl">H</span>
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        <p className="text-muted-foreground text-sm">Memuat...</p>
      </div>
    </div>
  )
}
