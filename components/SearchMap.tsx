import { useState, useEffect, useRef } from "react";
import { Search, LocateFixed } from "lucide-react";

interface SearchHeroMapProps {
  onSearch: (query: string, radius: number) => void;
  onLocate: () => void;
  isLoadingLocation: boolean;
}
interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

const SearchHeroMap = ({ onSearch, onLocate }: SearchHeroMapProps) => {
  const [radius, setRadius] = useState<number>(50);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        inputRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search on typing
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setSearchResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200); 

    setTypingTimeout(timeout);

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [searchQuery]);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setRadius(value);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    setSearchQuery(result.display_name.split(',')[0]); // Keep only city name
    setShowResults(false);
    onSearch(`${result.lat},${result.lon}`, radius);
  };

  const handleSearchButtonClick = () => {
    if (searchQuery.trim() !== "") {
      onSearch(searchQuery, radius);
    }
    setShowResults(false);
  };
  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-full flex items-center px-4 py-2 w-full max-w-lg relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Ville, code postal..."
          className="flex-grow text-gray-600 placeholder-gray-400 px-3 py-2 rounded-l-full focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
        />
        
        <div className="flex items-center px-3 border-l border-gray-300">
          <span className="text-gray-400 text-sm mr-2">RAYON</span>
          <input
            type="number"
            value={radius}
            onChange={handleRadiusChange}
            className="w-12 text-center text-gray-800 font-semibold bg-transparent"
            min="1"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="text-gray-600 ml-1">KM</span>
        </div>
        
        <button
          className="p-2 bg-[#9f9911] text-white rounded-full ml-2 hover:bg-[#6e6a0c] transition-colors"
          onClick={(e) => {
            e.preventDefault();
            onLocate();
          }}
          aria-label="Locate me"
          type="button"
        >
          <LocateFixed size={20} />
        </button>
        
        <button
          className="p-2 bg-gray-900 text-white rounded-full ml-2 hover:bg-gray-800 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            handleSearchButtonClick();
          }}
          aria-label="Search"
          type="button"
        >
          <Search size={20} />
        </button>

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div 
            ref={resultsRef}
            className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto"
            style={{ animation: "fadeIn 0.2s ease-in-out" }}
          >
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => handleSelectLocation(result)}
              >
                <p className="text-gray-800 text-sm font-medium">{result.display_name}</p>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="absolute right-24 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#9f9911] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SearchHeroMap;