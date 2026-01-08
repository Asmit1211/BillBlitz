export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img 
              src="/logo.png" 
              alt="BillBlitz Logo" 
              className="h-6 w-6 object-contain"
            />
            <h3 className="text-lg font-semibold text-gray-900">BillBlitz</h3>
          </div>
          <p className="text-sm text-gray-600">Blitz Your Bills in Seconds!</p>
          <p className="text-xs text-gray-500">
            © {currentYear} BillBlitz. Built for modern businesses.
          </p>
        </div>
      </div>
    </footer>
  )
}