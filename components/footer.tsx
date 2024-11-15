'use client'

export default function Footer() {

  return (
    <footer className="bg-gray-800 text-gray-100 dark:bg-gray-900 dark:text-gray-400">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <p className="text-sm">
          &copy; {new Date().getFullYear()}{" "}
          <span className="bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text font-bold dark:from-green-300 dark:to-blue-400">
            Wartezeiten Global
          </span>
          . All rights reserved.
        </p>
        <ul className="flex items-center gap-4 text-sm">
          <li>
            <a
              href="/privacy"
              className="hover:text-gray-300 dark:hover:text-gray-200"
            >
              Privacy Policy
            </a>
          </li>
          <li>
            <a
              href="/terms"
              className="hover:text-gray-300 dark:hover:text-gray-200"
            >
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}