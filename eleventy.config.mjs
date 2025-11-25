export default async function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("gifs.json");
  eleventyConfig.addPassthroughCopy("index.js");
  eleventyConfig.addPassthroughCopy("index.css");
};