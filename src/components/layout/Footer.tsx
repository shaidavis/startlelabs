export function Footer() {
  return (
    <footer className="py-8 px-8 text-sm text-neutral-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span>&copy; {new Date().getFullYear()} Startle Labs</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Instagram</a>
          <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
