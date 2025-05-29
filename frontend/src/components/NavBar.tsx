import { Bars3Icon, Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "./SearchBar";

interface Props {
	onToggleSidebar: () => void;
}

export default function NavBar({ onToggleSidebar }: Props) {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const queryParam = searchParams.get("q") || "";

	const handleSearch = (q: string) => {
		setSearchParams({ q });
		navigate({
			pathname: "/search",
			search: `?q=${encodeURIComponent(q)}`,
		});
	};

	return (
		<header className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800 shadow sticky top-0 z-10">
			<button
				onClick={onToggleSidebar}
				className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 mr-4 cursor-pointer"
			>
				<Bars3Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
			</button>

			<h1
				className="text-2xl font-bold cursor-pointer"
				onClick={() => navigate("/")}
			>
				YTO
			</h1>
			<div className="flex-1 px-4">
				<SearchBar
					onSearch={handleSearch}
					loading={false}
					initialValue={queryParam}
					showClear
				/>
			</div>
			<button
				onClick={() => navigate("/settings")}
				className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
			>
				<Cog6ToothIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
			</button>
		</header>
	);
}
