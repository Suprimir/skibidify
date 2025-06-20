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
      className="flex items-center gap-2 px-4 py-2 rounded-md select-none bg-rose-100 w-fit focus-within:outline-2 focus-within:outline-rose-400"
    >
      <label htmlFor="searchBarInput">
        <Search className="text-rose-400 size-6" />
      </label>
      <input
        id="searchBarInput"
        className="p-2 text-2xl focus:outline-0"
        placeholder="Search.."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </form>
  );
}
