import Link from "next/link";
import { Flame, History, Home, LayoutDashboard, Settings, Sparkles } from "lucide-react";

export function BrandNav({ marketing = false }: { marketing?: boolean }) {
  return <nav className="fixed left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/85 px-5 backdrop-blur-md md:px-8">
    <div className="flex items-center gap-8"><Link href="/" className="text-xl font-bold tracking-tight text-primary">OffScript</Link>
      {!marketing && <div className="hidden h-full items-center gap-6 md:flex"><Link className="flex h-full items-center border-b-2 border-primary pt-0.5 text-sm font-semibold text-primary" href="/dashboard">Home</Link><Link className="text-sm text-muted-foreground hover:text-primary" href="/dashboard">Progress</Link><Link className="text-sm text-muted-foreground hover:text-primary" href="/dashboard">History</Link></div>}
    </div>
    {marketing ? <div className="hidden items-center gap-6 md:flex"><a href="#framework" className="text-sm text-muted-foreground hover:text-primary">How it works</a><a href="#preview" className="text-sm text-muted-foreground hover:text-primary">Preview</a><Link href="/dashboard" className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#2f2ebe]">Sign in</Link></div> : <Link href="/dashboard" aria-label="Open profile" className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary ring-2 ring-transparent transition hover:ring-primary">OS</Link>}
  </nav>;
}

export function AppSidebar() {
  return <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r border-border/70 bg-[#f3f4f5] p-3 md:flex">
    <div className="px-4 py-4"><h2 className="text-2xl font-bold text-primary">Dashboard</h2><p className="mt-1 text-[11px] font-semibold uppercase tracking-[.12em] text-muted-foreground">Communication practice</p></div>
    <Link href="/dashboard" className="mx-4 mb-6 flex items-center justify-center gap-2 rounded-lg border border-[#767586] px-3 py-3 text-xs font-semibold text-[#575e70] transition hover:bg-white"><Sparkles size={17}/> New practice session</Link>
    <nav className="flex flex-1 flex-col gap-1 text-sm font-semibold"><Link href="/dashboard" className="flex items-center gap-3 rounded-lg bg-secondary px-4 py-3 text-primary"><Home size={18}/> Today&apos;s challenge</Link><Link href="#stats" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#575e70] transition hover:bg-white"><LayoutDashboard size={18}/> My stats</Link><Link href="#archives" className="flex items-center gap-3 rounded-lg px-4 py-3 text-[#575e70] transition hover:bg-white"><History size={18}/> Archives</Link></nav>
    <div className="mb-5 rounded-xl border border-[#c7c4d7] bg-white p-4 shadow-sm"><div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-semibold uppercase tracking-wider text-[#575e70]">Current streak</span><Flame size={18} className="text-[#00885d]"/></div><div className="mb-3 text-3xl font-bold">12 <span className="text-base font-normal text-muted-foreground">days</span></div><div className="grid grid-cols-7 gap-1">{[1,2,3,4,5,3,0].map((level, index) => <span key={index} className={`h-5 rounded-sm ${level ? `heatmap-${level}` : "bg-[#e1e3e4]"}`}/>)}</div></div>
    <div className="flex flex-col gap-1 border-t border-border pt-2 text-sm text-[#575e70]"><Link href="#settings" className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white"><Settings size={18}/> Settings</Link><Link href="#help" className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-white"><span className="flex size-[18px] items-center justify-center rounded-full border text-xs">?</span> Help</Link></div>
  </aside>;
}

export function Heatmap() {
  return <div className="grid grid-cols-7 gap-2">{Array.from({ length: 28 }, (_, index) => <span key={index} className={`heatmap-cell ${[0,4,7,12,13,17,20,22,25,26].includes(index) ? "heatmap-1" : [1,5,8,14,18,23].includes(index) ? "heatmap-2" : [3,9,15,19,24,27].includes(index) ? "heatmap-3" : index === 11 ? "heatmap-4" : ""}`}/>)}</div>;
}
