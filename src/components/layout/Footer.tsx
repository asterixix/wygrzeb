import Link from "next/link";
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const Footer: React.FC = () => (
  <footer className="py-6 border-t border-base-300 bg-base-100">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-base-content/70 mb-4 md:mb-0">
          © 2025 Wygrzeb - Inteligentna wyszukiwarka informacji
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/about" className="link link-hover">O projekcie</Link>
          <Link href="/privacy" className="link link-hover">Prywatność</Link>
          <Link href="/contact" className="link link-hover">Kontakt</Link>
          <a href="https://twitter.com/wygrzeb" target="_blank" rel="noopener noreferrer" className="link link-hover flex items-center gap-1">
            <ChatBubbleLeftRightIcon className="h-4 w-4" /> <span className="ml-1">Twitter</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer; 