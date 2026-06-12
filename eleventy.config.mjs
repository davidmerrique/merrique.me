export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("gifs.json");
  eleventyConfig.addPassthroughCopy("gifs");
  eleventyConfig.addPassthroughCopy("index.js");
  eleventyConfig.addPassthroughCopy("index.css");
};