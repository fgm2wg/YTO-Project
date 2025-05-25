export default function SidePanel() {
	const tabs = ["Home", "Playlists", "History", "Settings"];
	return (
		<nav className="w-48 p-4 bg-white shadow-inner">
			<ul className="space-y-2">
				{tabs.map((tab) => (
					<li key={tab}>
						<button className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
							{tab}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}
