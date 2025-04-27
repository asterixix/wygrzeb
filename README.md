# Wygrzeb - Agregator Informacji i Narzędzie Fact-Checkingowe

Wygrzeb to aplikacja internetowa stworzona w Next.js, której celem jest agregowanie wyników wyszukiwania z różnorodnych źródeł danych, ze szczególnym uwzględnieniem wsparcia weryfikacji informacji (fact-checking). Umożliwia użytkownikom przeszukiwanie wiadomości, danych rządowych, statystyk, baz fact-checkingowych oraz mediów społecznościowych w jednym miejscu.

## Kluczowe Funkcje

*   **Wszechstronne Wyszukiwanie**: Agreguje wyniki z wielu źródeł jednocześnie.
*   **Weryfikacja Informacji**: Ułatwia dostęp do źródeł fact-checkingowych i danych publicznych.
*   **Zaawansowane Filtrowanie**: Pozwala precyzować wyniki według daty, źródła, typu danych itp.
*   **Różnorodne Źródła Danych**: Integruje API informacyjne, rządowe i społecznościowe.

## Źródła Danych i API

Aplikacja korzysta obecnie z następujących źródeł danych i API:

*   **Wiadomości**:
    *   Google News (przez SerpApi lub dedykowane API)
    *   NewsAPI
*   **Fact-Checking**:
    *   Google Fact Check API
*   **Dane Publiczne (Polska)**:
    *   DANE.GOV.PL API (`api.dane.gov.pl`)
    *   Statistics Poland (GUS) API (`api-dbw.stat.gov.pl`)
    *   SDG API (`sdg.gov.pl`)
*   **Media Społecznościowe**:
    *   Twitter/X API v2

## Architektura

Aplikacja zbudowana jest przy użyciu Next.js. Wyszukiwania są obsługiwane przez dedykowane trasy API (`src/api/*`), które komunikują się z zewnętrznymi serwisami, normalizują odpowiedzi i zwracają je do front-endu w ujednoliconym formacie (`FactCheckResult` i inne typy w `src/types`).

## Technologia

*   **Framework**: Next.js
*   **Język**: TypeScript
*   **UI**: Material-UI (MUI)
*   **Zapytania HTTP**: Axios
*   **Zarządzanie Stanem**: React Context API (lub inne, w zależności od implementacji)

## Konfiguracja Lokalna

Aby uruchomić aplikację lokalnie, postępuj zgodnie z poniższymi krokami:

### Krok 1: Sklonuj Repozytorium (jeśli dotyczy)

```bash
git clone <adres-repozytorium>
cd wygrzeb
```

### Krok 2: Zainstaluj Zależności

Upewnij się, że masz zainstalowany Node.js i npm (lub yarn). Następnie zainstaluj wymagane pakiety:

```bash
npm install
# lub
# yarn install
```

### Krok 3: Skonfiguruj Zmienne Środowiskowe

W głównym katalogu projektu utwórz plik `.env.local`. Skopiuj zawartość z `.env.example` (jeśli istnieje) lub utwórz go od nowa, dodając klucze API dla poszczególnych serwisów.

```plaintext
# .env.local

# Klucze API (uzyskaj je z odpowiednich serwisów)
NEWS_API_KEY=twoj_klucz_newsapi
GOOGLE_FACT_CHECK_API_KEY=twoj_klucz_google_fact_check
# SERPAPI_KEY=twoj_klucz_serpapi # Jeśli używasz SerpApi dla Google News
# GOOGLE_NEWS_API_KEY= # Alternatywnie, jeśli jest dedykowane API

# Klucze API dla Twitter/X (wymagane Bearer Token)
TWITTER_BEARER_TOKEN=twoj_bearer_token_twitter

# Klucze API dla polskich danych (często opcjonalne, ale zalecane)
DANE_GOV_API_KEY=twoj_klucz_dane_gov # Opcjonalny
STAT_GOV_API_KEY=twoj_klucz_stat_gov # Opcjonalny (X-ClientId)
# SDG_API_KEY= # SDG Poland może nie wymagać klucza lub używać innego mechanizmu (np. GitHub Token dla repozytorium danych)
GITHUB_TOKEN=twoj_token_github # Może być używany przez SDG API

# Inne konfiguracje (jeśli są potrzebne)
# NEXT_PUBLIC_...
```

**Uwaga:** Niektóre API (np. DANE.GOV.PL, STAT.GOV.PL) mogą działać bez klucza API, ale z niższymi limitami zapytań. Klucz Twitter/X jest zazwyczaj wymagany.

### Krok 4: Uruchom Aplikację

Uruchom serwer deweloperski Next.js:

```bash
npm run dev
# lub
# yarn dev
```

Aplikacja powinna być dostępna pod adresem `http://localhost:3000`.

## Użycie

Po uruchomieniu aplikacji:
1. Wpisz zapytanie w głównym polu wyszukiwania.
2. (Opcjonalnie) Użyj dostępnych filtrów, aby zawęzić wyniki (np. wybierając konkretne źródła, zakres dat).
3. Kliknij przycisk "Szukaj".
4. Przeglądaj zagregowane wyniki z różnych źródeł. Każdy wynik powinien wskazywać swoje źródło.

## Wkład i Rozwój

Zachęcamy do wkładu w rozwój aplikacji "Wygrzeb"!

*   **Zgłaszanie Błędów i Sugestii**: Jeśli znajdziesz błąd lub masz pomysł na nową funkcjonalność, zgłoś go, tworząc nowe zgłoszenie (issue) w sekcji Issues repozytorium GitHub projektu.
*   **Pull Requesty**: Chętnie przyjmujemy pull requesty z poprawkami lub nowymi funkcjami. Aby ułatwić proces przeglądu i integracji zmian, prosimy o stosowanie się do standardu [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) przy tworzeniu wiadomości commitów.

Przed przesłaniem pull requesta upewnij się, że:
    *   Kod został przetestowany (jeśli dotyczy).
    *   Wiadomości commitów są zgodne ze standardem Conventional Commits.
    *   Opis pull requesta jasno wyjaśnia wprowadzone zmiany i motywację.

## Podsumowanie

Wygrzeb to narzędzie mające na celu ułatwienie dostępu do informacji z wielu źródeł i wspieranie krytycznego podejścia do konsumowanych treści poprzez integrację mechanizmów fact-checkingowych i danych publicznych.