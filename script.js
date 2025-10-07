document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const pageSections = document.querySelectorAll(".page-section");
  const searchBtn = document.getElementById("searchbtn");
  const clearBtn = document.getElementById("clearbtn");
  const searchInput = document.getElementById("searchinput");
  const dropdown = document.getElementById("dropdown");
  const resultContainer = document.getElementById("resultContainer");
  const closeBtn = document.getElementById("close-btn");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      pageSections.forEach((section) => section.classList.add("hidden"));
      document.getElementById(targetId).classList.remove("hidden");
      navLinks.forEach((navLink) => navLink.classList.remove("active"));
      link.classList.add("active");
    });
  });
  document.querySelector('a[href="#home"]').click();
  const clearSearch = () => {
    searchInput.value = "";
    dropdown.style.display = "none";
  };
  const showResults = (results) => {
    dropdown.style.display = "block";
    resultContainer.innerHTML = "";
    if (results.length === 0) {
      resultContainer.innerHTML = `<p class="notfound">Sorry, no recommendations found.</p>`;
      return;
    }
    results.forEach((item) => {
      const localTime = item.time
        ? new Date().toLocaleTimeString("en-US", {
            timeZone: item.time,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "";
      const timeElement = item.time
        ? `<div class="local-time">Current Local Time: ${localTime}</div>`
        : "";

      const resultCard = `
                <div class="result-card">
                    ${timeElement}
                    <h3 class="title">${item.name}</h3>
                    <img class="search-img" src="${item.imageUrl}" alt="${item.name}">
                    <p class="description">${item.description}</p>
                    <button class="btn-visit">Visit</button>
                </div>`;
      resultContainer.innerHTML += resultCard;
    });
  };
  fetch("travelrecommendation.json")
    .then((response) => response.json())
    .then((data) => {
      const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
          clearSearch();
          return;
        }
        const foundResults = [];
        const keywords = ["temple", "beach", "country"];
        let searchType = "";
        if (keywords.some((k) => query.includes(k))) {
          if (query.includes("temple")) searchType = "temples";
          if (query.includes("beach")) searchType = "beaches";
        }

        if (searchType) {
          foundResults.push(...data[searchType]);
        } else {
          data.countries.forEach((country) => {
            if (country.name.toLowerCase().includes(query)) {
              foundResults.push(...country.cities);
            } else {
              country.cities.forEach((city) => {
                if (city.name.toLowerCase().includes(query))
                  foundResults.push(city);
              });
            }
          });
        }
        showResults(foundResults);
      };
      searchBtn.addEventListener("click", performSearch);
      searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          performSearch();
        }
      });
    })
    .catch((error) => console.error("Error fetching travel data:", error));
  clearBtn.addEventListener("click", clearSearch);
  closeBtn.addEventListener("click", () => (dropdown.style.display = "none"));
});
