import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function NavBar() {
	const navigate = useNavigate();

	const handleSearch = (q: string) => {
		navigate(`/search?q=${encodeURIComponent(q)}`);
	};

	return (
		<header className="flex items-center justify-between px-6 py-4 bg-white shadow">
			<h1 className="text-2xl font-bold">YTO</h1>

			<div className="flex-1 px-4">
				<SearchBar onSearch={handleSearch} loading={false} />
			</div>

			<button className="p-2 rounded hover:bg-gray-100 cursor-pointer">
				<Cog6ToothIcon className="w-6 h-6 text-gray-600" />
			</button>
		</header>
	);
}
