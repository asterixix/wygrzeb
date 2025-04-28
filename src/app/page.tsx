"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  NewspaperIcon,
  ChartBarIcon, 
  MagnifyingGlassCircleIcon, 
  ShieldCheckIcon, 
  AdjustmentsHorizontalIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon, // For Twitter/Social
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import wygrzebLogoBlack from '@/images/wygrzeb-logo-black.svg';
import wygrzebLogoWhite from '@/images/wygrzeb-logo-white.svg';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsLoading(true);
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-100 text-base-content">
      <div className="container mx-auto px-4 flex-grow flex flex-col justify-center py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            {/* Wygrzeb Logo: show black in light mode, white in dark mode */}
            <span className="block w-full flex justify-center">
              <Image
                src={wygrzebLogoBlack}
                alt="Wygrzeb logo"
                width={180}
                height={54}
                className="h-16 w-auto dark:hidden"
                draggable="false"
                priority
              />
              <Image
                src={wygrzebLogoWhite}
                alt="Wygrzeb logo"
                width={180}
                height={54}
                className="h-16 w-auto hidden dark:block"
                draggable="false"
                priority
              />
            </span>
          </h1>
          <p className="text-xl text-base-content/70 mb-8 max-w-3xl mx-auto">
            Inteligentne wyszukiwanie faktów, statystyk i aktualnych informacji z
            wiarygodnych źródeł krajowych i zagranicznych
          </p>

          <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
            <div className="join w-full shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out border border-base-300 rounded-lg hover:border-primary">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Wyszukaj fakty, dane, statystyki i wiadomości..."
                className="input input-bordered join-item w-full focus:outline-none focus:ring-0"
              />
              <button 
                type="submit" 
                aria-label="search"
                disabled={isLoading || !searchQuery.trim()}
                className="btn btn-primary join-item"
              >
                {isLoading ? <span className="loading loading-spinner"></span> : 'Szukaj'} 
              </button>
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            <div className="card bg-base-100 shadow-md border border-base-300 border-l-4 border-l-blue-500 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
              <div className="card-body items-center text-center">
                <NewspaperIcon className="text-blue-500 h-10 w-10 mb-2" /> 
                <h3 className="card-title">Wiadomości</h3>
                <p className="text-base-content/70">Bieżące informacje z polskich i zagranicznych źródeł informacyjnych</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md border border-base-300 border-l-4 border-l-green-500 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
              <div className="card-body items-center text-center">
                <h3 className="card-title">Weryfikacja faktów</h3>
                <p className="text-base-content/70">Zweryfikowane informacje z niezależnych organizacji fact-checkingowych</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md border border-base-300 border-l-4 border-l-orange-500 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl">
              <div className="card-body items-center text-center">
                <ChartBarIcon className="text-orange-500 h-10 w-10 mb-2" />
                <h3 className="card-title">Dane i statystyki</h3>
                <p className="text-base-content/70">Oficjalne dane z Głównego Urzędu Statystycznego i dane.gov.pl</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 shadow-lg rounded-lg text-center bg-base-200">
              <MagnifyingGlassCircleIcon className="text-primary h-12 w-12 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Wszechstronne Wyszukiwanie</h3>
              <p className="text-base-content/80">Agreguj wyniki z wielu źródeł: wiadomości, fact-checków, danych rządowych i mediów społecznościowych.</p>
            </div>
            <div className="p-6 shadow-lg rounded-lg text-center bg-base-200">
              <ShieldCheckIcon className="text-primary h-12 w-12 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Weryfikacja Informacji</h3>
              <p className="text-base-content/80">Szybko sprawdzaj fakty i identyfikuj potencjalną dezinformację dzięki dostępowi do wiarygodnych źródeł.</p>
            </div>
            <div className="p-6 shadow-lg rounded-lg text-center bg-base-200">
              <AdjustmentsHorizontalIcon className="text-primary h-12 w-12 mx-auto mb-3" />
              <h3 className="text-xl font-semibold mb-2">Zaawansowane Filtrowanie</h3>
              <p className="text-base-content/80">Precyzuj wyszukiwanie za pomocą filtrów daty, źródła, typu danych i trafności.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/search" className="btn btn-primary btn-lg">
              Przejdź do zaawansowanego wyszukiwania
            </Link>
            <a 
              href="https://github.com/yourusername/wygrzeb" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Zobacz kod źródłowy
            </a>
          </div>

          <div className="my-12">
            <h2 className="text-3xl font-bold text-center mb-6">Nasze Źródła Danych</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center">
              <div className="p-4 shadow rounded-lg bg-base-200 flex items-center gap-2">
                <NewspaperIcon className="h-5 w-5 text-blue-500" /> Wiadomości (Google News, NewsAPI)
              </div>
              <div className="p-4 shadow rounded-lg bg-base-200 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-sky-500" /> Media Społecznościowe (Twitter/X)
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-md max-w-3xl mx-auto p-6 border border-base-300 rounded-lg">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <InformationCircleIcon className="h-5 w-5 text-info" /> Dostępne źródła danych
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="block mb-1">Polskie:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>GUS / Stat.gov.pl</li>
                  <li>Dane.gov.pl</li>
                  <li>Polskie media</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-1">Zagraniczne:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>Google News</li>
                  <li>Media międzynarodowe</li>
                </ul>
              </div>
              <div>
                <strong className="block mb-1">Media społecznościowe:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>Twitter/X</li>
                  <div className="tooltip tooltip-bottom" data-tip="Wkrótce dostępne">
                    <li className="text-base-content/50 cursor-default">Facebook (wkrótce)</li>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
