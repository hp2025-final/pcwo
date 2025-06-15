import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-white text-black animated-gradient-border border-b-0 border-l-0 border-r-0 border-t mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-roboto font-bold text-lg tracking-tight">PCWV2</div>        <div className="flex gap-4 text-xs font-inter font-medium">
          <Link href="#" className="hover:text-blue-600 transition">Privacy</Link>
          <Link href="#" className="hover:text-blue-600 transition">Terms</Link>
          <Link href="#" className="hover:text-blue-600 transition">Contact</Link>
        </div>
        <div className="text-xs text-gray-500 font-inter">© {new Date().getFullYear()} PCWV2. All rights reserved.</div>
      </div>
    </footer>
  )
}
