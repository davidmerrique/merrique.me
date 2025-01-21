import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

export default async function (eleventyConfig) {
	eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addWatchTarget("./src/css/");
	eleventyConfig.addPlugin(eleventyNavigationPlugin);
}

export const config = {
	dir: {
		input: "src",
	},
};
