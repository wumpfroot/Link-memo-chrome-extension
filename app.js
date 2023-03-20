const form = document.getElementById("todoform");
const linkInput = document.getElementById("newlink");
const linksListEl = document.getElementById("links-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const tabBtn = document.getElementById("tab-btn");

let links = [];

//Submit eventlisterer
form.addEventListener("submit", (e) => {
	e.preventDefault();

	saveLink();
	renderLinks();
	localStorage.setItem("links", JSON.stringify(links));
});

//function that removes extra https from url.
function removeHttp(url) {
	return url.replace(/^https?:\/\//, "");
}

//Function that allows us save our links using the input
const saveLink = () => {
	const linkValue = removeHttp(linkInput.value);
	console.log(linkValue);
	const isEmpty = linkValue === "";

	if (isEmpty) {
		alert("Input is empty");
	} else {
		links.push({
			value: linkValue,
			id: Math.random(),
		});
		linkInput.value = "";
	}
	console.log(links);
};

//Function that renders our links to the page
const renderLinks = () => {
	const prefix = "https://";
	if (links.length === 0) {
		linksListEl.innerHTML = `<center>No links here...</center>`;
		return;
	}
	linksListEl.innerHTML = "";

	links.forEach((link, index) => {
		linksListEl.innerHTML += `
		<div class="link" id=${index}>
			
					<a class="url-link" href=${
						prefix + link.value
					} target="_blank" rel="noopener">${link.value}</a>
					<button data-action="delete" class="delete-link">❌</button>

		</div>
		`;
	});
};

//Allows us to target a specific element and to perform an action to it. In this case: delete
linksListEl.addEventListener("click", (e) => {
	const target = e.target;
	const parentElement = target.parentNode;

	if (parentElement.className !== "link") return;
	const link = parentElement;
	const linkId = Number(link.id);
	const action = target.dataset.action;
	action === "delete" && deleteLink(linkId);
});

//Click eventlistener for deleting all links at once
deleteAllBtn.addEventListener("click", function () {
	let confirmDelAll = confirm("Are you sure you want delete all the links?");
	if (!confirmDelAll) return;
	localStorage.removeItem("links");
	links = [];
	renderLinks(links);
});

//Function to delete a single link based on its index and ID
const deleteLink = (linkId) => {
	links = links.filter((todo, index) => index !== linkId);
	renderLinks();
	localStorage.setItem("links", JSON.stringify(links));
};

//Parsing the localStorage info and rendering it to the page
const linksFromLocalStorage = JSON.parse(localStorage.getItem("links"));
if (linksFromLocalStorage) {
	links = linksFromLocalStorage;
	renderLinks(links);
}

//Using the Chrome tabs API to retrieve the tab URL when clicking the Save tab button
tabBtn.addEventListener("click", function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const url = removeHttp(tabs[0].url);
		const newTabLink = {
			id: Math.random(),
			value: url,
		};
		links.push(newTabLink);
		localStorage.setItem("links", JSON.stringify(links));
		renderLinks(links);
	});
});
