const linkList = document.querySelectorAll(".Links li");
const touch = "ontouchstart" in window;
const hoverEnabled = !touch && window.innerWidth >= 768;
let imgPromise;
let hovering = false;
let lastUrl;

if (hoverEnabled) {
	imgPromise = loadRandomImage();
}

if (window.innerWidth >= 768) {
	for (const link of linkList) {
		if (hoverEnabled) {
			link.addEventListener("mouseenter", onEnter, false);
			link.addEventListener("mouseleave", onLeave, false);
		}

		link.style.display = "block";
		link.style.top = `${Math.round(Math.random() * 90)}%`;
		link.style.left = `${Math.round(Math.random() * 90)}%`;
	}
}

async function loadRandomImage(attempts = 3) {
	const { default: gifs } = await import("./gifs.json", {
		with: { type: "json" },
	});

	let url;
	do {
		url = gifs[Math.floor(Math.random() * gifs.length)];
	} while (gifs.length > 1 && url === lastUrl);
	lastUrl = url;

	try {
		return await preloadImage(url);
	} catch (error) {
		if (attempts > 1) return loadRandomImage(attempts - 1);
		throw error;
	}
}

function preloadImage(url) {
	return new Promise((resolve, reject) => {
		const img = new window.Image();
		// Speculative fetch — don't compete with critical resources.
		img.fetchPriority = "low";
		img.addEventListener("load", () => resolve(img));
		img.addEventListener("error", () => reject(new Error(`failed: ${url}`)));
		img.src = url;
	});
}

function onEnter() {
	hovering = true;
	imgPromise.then(
		(img) => {
			if (!hovering) return;
			document.documentElement.style.setProperty(
				"--background-image",
				`url('${img.src}')`
			);
			imgPromise = loadRandomImage();
		},
		() => {
			imgPromise = loadRandomImage();
		}
	);
}

function onLeave() {
	hovering = false;
	document.documentElement.style.setProperty("--background-image", "none");
}

class EmailButton extends HTMLElement {
	static tagName = "email-button";

	get button() {
		return this.querySelector("button");
	}

	connectedCallback() {
		this.button.addEventListener("click", this);
	}

	disconnectedCallback() {
		this.button.removeEventListener("click", this);
	}

	handleEvent() {
		navigator.clipboard.writeText("david@merrique.me");
		this.button.classList.add("copied");
		this.button.textContent = "Copied!";
		setTimeout(() => {
			this.button.classList.remove("copied");
			this.button.textContent = "Email";
		}, 3000);
	}
}

if (!customElements.get(EmailButton.tagName)) {
	customElements.define(EmailButton.tagName, EmailButton);
}
