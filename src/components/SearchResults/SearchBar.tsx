import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  submit: (searchTerm: string) => void;
}

export default function SearchBar({ submit }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      submit(searchTerm);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex items-center gap-2 px-4 py-2 rounded-4xl shadow-md select-none bg-primary-100 max-w-screen focus-within:outline-2 outline-1 outline-primary-400 focus-within:outline-primary-400 transition duration-300"
    >
      <label htmlFor="searchBarInput">
        <Search className="text-primary-400 size-6" />
      </label>
      <input
        id="searchBarInput"
        className="w-full p-2 text-2xl focus:outline-0 placeholder:text-primary-400 text-primary-600 font-semibold"
        placeholder="Search..."
        spellCheck="false"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
}
