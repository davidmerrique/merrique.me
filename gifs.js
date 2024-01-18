import fs from "node:fs";
import got from "got";

import existing from "./src/gifs.json" assert { type: "json" };

async function scrape() {
	try {
		const giphyResponse = await got("https://api.giphy.com/v1/gifs/trending", {
			searchParams: {
				api_key: "Q6lTJjpy5Kj7kk3jZ3rFXz37Ill6zJ4F",
				limit: 100,
				rating: "R",
			},
		}).json();

		const giphy = giphyResponse.data.map((gif) => {
			const originalUrl = new URL(gif.images.original.url);
			return "https://i.giphy.com" + originalUrl.pathname;
		});

		write(giphy);
	} catch (error) {
		console.log(error);
	}
}

function write(gifs) {
	const newList = [...existing, ...gifs];
	fs.writeFileSync(
		"./src/gifs.json",
		JSON.stringify([...new Set(newList)], undefined, 2)
	);
}

scrape();
