---
title: Carousel Techniques
tags: css
---

## Flexbox

```html
<div class="wrapper">
	<ul>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
	</ul>
</div>
```

```css
.wrapper {
	overflow: scroll;
	container: wrapper / inline-size;
	--_gap: 0px;
	--_item-size: calc(25cqi - var(--_gap));

	ul {
		display: flex;
		gap: var(--_gap);
		list-style: none;
		margin: 0;
		padding: 0;

    li {
			aspect-ratio: 4/5;
			background: grey;
			box-shadow: inset 0 0 1px currentColor;
			inline-size: var(--_item-size);
			min-inline-size: var(--_item-size);
		}
	}
}
```

<style>
  .wrapper {
	overflow: scroll;
	container: wrapper / inline-size;
	--_gap: 0px;
	--_item-size: calc(25cqi - var(--_gap));

	ul {
		display: flex;
		gap: var(--_gap);
		list-style: none;
		margin: 0;
		padding: 0;

    li {
			aspect-ratio: 4/5;
			background: grey;
			box-shadow: inset 0 0 1px currentColor;
			inline-size: var(--_item-size);
			min-inline-size: var(--_item-size);
		}
	}
}
</style>
<div class="wrapper">
	<ul>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
	</ul>
</div>