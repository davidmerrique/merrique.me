import fs from "node:fs";
import path from "node:path";

import existing from "./gifs.json" with { type: "json" };

const GIF_DIR = "./gifs";
const CONCURRENCY = 16;
const MAX_BYTES = 5 * 1024 * 1024;

async function giphy() {
	const url = new URL("https://api.giphy.com/v1/gifs/trending");
	url.searchParams.set("api_key", process.env.GIPHY_API_KEY);
	url.searchParams.set("limit", 100);
	url.searchParams.set("rating", "R");

	const response = await fetch(url).then((res) => res.json());

	return response.data.map((gif) => {
		const originalUrl = new URL(gif.images.original.url);
		return "https://i.giphy.com" + originalUrl.pathname.replace(/\.gif$/, ".webp");
	});
}

async function klipy(page) {
	const url = new URL(
		`https://api.klipy.com/api/v1/${process.env.KLIPY_API_KEY}/gifs/trending`
	);
	url.searchParams.set("per_page", 50);
	url.searchParams.set("page", page);
	url.searchParams.set("rating", "r");

	const response = await fetch(url).then((res) => res.json());

	return response.data.data.map((gif) => gif.file.hd.webp.url);
}

// Stable filename per gif so re-runs skip files already on disk.
function localName(url) {
	const { hostname, pathname } = new URL(url);
	const parts = pathname.split("/");
	const ext = path.extname(pathname);
	if (hostname === "i.giphy.com") {
		// Path is either /media/.../<id>/giphy.webp or just /<id>.webp
		const id = parts[parts.length - 2] || path.basename(pathname, ext);
		return `giphy-${id}${ext}`;
	}
	if (hostname === "static.klipy.com") return `klipy-${parts[2]}${ext}`;
	return parts[parts.length - 1];
}

async function download(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${response.status} ${url}`);
	const buffer = Buffer.from(await response.arrayBuffer());
	if (buffer.byteLength > MAX_BYTES) {
		throw new Error(`too large (${Math.round(buffer.byteLength / 1048576)} MiB) ${url}`);
	}
	fs.writeFileSync(path.join(GIF_DIR, localName(url)), buffer);
}

async function scrape() {
	fs.mkdirSync(GIF_DIR, { recursive: true });

	const results = await Promise.allSettled([giphy(), klipy(1), klipy(2)]);
	for (const result of results) {
		if (result.status === "rejected") console.log(result.reason);
	}

	const remote = results
		.filter((result) => result.status === "fulfilled")
		.flatMap((result) => result.value)
		// Any remote urls still in gifs.json get downloaded and migrated too.
		.concat(existing.filter((entry) => entry.startsWith("http")));

	const queue = [...new Set(remote)].filter(
		(url) => !fs.existsSync(path.join(GIF_DIR, localName(url)))
	);

	let downloaded = 0;
	await Promise.all(
		Array.from({ length: CONCURRENCY }, async () => {
			while (queue.length) {
				const url = queue.shift();
				try {
					await download(url);
					downloaded++;
				} catch (error) {
					console.log(error.message);
				}
			}
		})
	);

	const gifs = fs
		.readdirSync(GIF_DIR)
		.filter((file) => file.endsWith(".webp") || file.endsWith(".gif"))
		.sort()
		.map((file) => `/gifs/${file}`);

	fs.writeFileSync("./gifs.json", JSON.stringify(gifs, undefined, 2));

	console.log(`${downloaded} gifs downloaded, ${gifs.length} total`);
}

scrape();
