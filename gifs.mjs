import fs from "node:fs";

import existing from "./gifs.json" assert { type: "json" };

async function scrape() {
	try {
		const url = new URL("https://api.giphy.com/v1/gifs/trending");
		url.searchParams.set("api_key", "Q6lTJjpy5Kj7kk3jZ3rFXz37Ill6zJ4F");
		url.searchParams.set("limit", 100);
		url.searchParams.set("rating", "R");

		const giphyResponse = await fetch(url.toString()).then((res) => res.json());

		const gifs = giphyResponse.data.map((gif) => {
			const originalUrl = new URL(gif.images.original.url);
			return "https://i.giphy.com" + originalUrl.pathname;
		});

		const newList = [...existing, ...gifs];
		fs.writeFileSync(
			"./gifs.json",
			JSON.stringify([...new Set(newList)], undefined, 2)
		);
	} catch (error) {
		console.log(error);
	}
}

scrape();
