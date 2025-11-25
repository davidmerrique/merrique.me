const linkList = document.querySelectorAll(".Links li");
const touch = "ontouchstart" in window;
let webP = false;
let imgPromise;

testWebP().then((hasWebP) => (webP = hasWebP));

if (!touch) {
	imgPromise = loadRandomImage();
}

if (window.innerWidth >= 768) {
	for (const link of linkList) {
		link.addEventListener("mouseenter", onEnter, false);
		link.addEventListener("mouseleave", onLeave, false);

		link.style.display = "block";
		link.style.top = `${Math.round(Math.random() * 90)}%`;
		link.style.left = `${Math.round(Math.random() * 90)}%`;
	}
}

async function loadRandomImage() {
	const { default: gifs } = await import("./gifs.json", {
		with: { type: "json" },
	});
	return await new Promise((resolve, reject) => {
		const img = new window.Image();
		const url = gifs[Math.floor(Math.random() * gifs.length)] || "";
		img.addEventListener("load", () => resolve(img));
		img.addEventListener("error", () => reject(url));
		img.src =
			url.includes("i.giphy") && webP ? url.replace(".gif", ".webp") : url;
	});
}

function onEnter() {
	if (!touch) {
		imgPromise.then((img) => {
			document.documentElement.style.setProperty(
				"--background-image",
				`url('${img.src}')`
			);
			imgPromise = loadRandomImage();
		});
	}
}

function testWebP() {
	return new Promise((response) => {
		const webP = new Image();
		webP.src =
			"data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
		webP.addEventListener("load", () => response(webP.height === 2));
		webP.addEventListener("error", () => response(webP.height === 2));
	});
}

function onLeave() {
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
