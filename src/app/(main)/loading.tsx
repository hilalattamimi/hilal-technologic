import { Loader2 } from 'lucide-react'

export default function MainLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        <p className="text-muted-foreground text-sm">Memuat...</p>
      </div>
    </div>
  )
}
