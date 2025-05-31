import {
	HomeIcon,
	MusicalNoteIcon,
	ClockIcon,
	Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { Link, useLocation } from "react-router-dom";

const tabs = [
	{ label: "Home", to: "/", Icon: HomeIcon },
	{ label: "Playlists", to: "/playlists", Icon: MusicalNoteIcon },
	{ label: "History", to: "/history", Icon: ClockIcon },
	{ label: "Settings", to: "/settings", Icon: Cog6ToothIcon },
];

interface Props {
	className?: string;
}

export default function SidePanel({ className = "" }: Props) {
	const { pathname } = useLocation();

	return (
		<nav
			className={
				`${className} ` +
				`w-48 h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 ` +
				`shadow-inner p-4 overflow-y-auto`
			}
		>
			<ul className="space-y-2">
				{tabs.map(({ label, to, Icon }) => (
					<li key={label}>
						<Link
							to={to}
							className={
								"flex items-center px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer " +
								(pathname === to
									? "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white font-medium"
									: "")
							}
						>
							<Icon className="w-5 h-5 mr-2 text-accent" />
							<span>{label}</span>
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
