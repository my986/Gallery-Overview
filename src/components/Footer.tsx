interface FooterProps {
  isDarkMode: boolean;
}

export function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`border-t mt-20 ${
      isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'
    }`}>
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <p className={`text-sm text-center ${
          isDarkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          © 2024 My Design Clips. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
