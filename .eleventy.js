const lightningCSS = require("@11tyrocks/eleventy-plugin-lightningcss");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPlugin(lightningCSS);
  eleventyConfig.addPassthroughCopy("gifs.json");
  eleventyConfig.addPassthroughCopy("index.js");
};