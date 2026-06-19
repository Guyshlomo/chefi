fetch("/JSON/categories.json")
    .then(response => response.json())
    .then(catagories => {
        const catagory = document.getElementById("foodCategories");

        catagory.innerHTML = catagories.map(card_catagory => {
            return `
        <a href="#">
          <i class="${card_catagory.icon}"></i>
          <span>${card_catagory.name}</span>
        </a>
      `;
        }).join("");
    })
    .catch(error => {
        console.error("Error loading categories:", error);
    });