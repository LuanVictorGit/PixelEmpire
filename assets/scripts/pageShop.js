let config, categorys;
let menuIsShowing = false;
document.addEventListener("DOMContentLoaded", async (e) => {

    // dando fetch nas categorias da config.
    const elementCategorys = document.getElementById("ulCategoryShop");
    try {
        const response = await fetch('http://localhost:3000/config');
        if (response.ok) {
            config = await response.json();
            categorys = config["categorys"];

            for (let item in categorys) {
                const nameCategory = item;
                const imageCategory = categorys[nameCategory]["image"];
                const subcategory = categorys[nameCategory]["subcategory"];
                if (subcategory && Object.keys(categorys).includes(subcategory)) {
                    elementCategorys.innerHTML += `<li class="liShop" id="category${nameCategory}Li"><a href="#" class="button buttonShop hidden" id="category${nameCategory}" title="clique para acessar a categoria ${nameCategory}"><img src="${imageCategory}" alt="icone ${nameCategory}"> <p class="textCategoryShop">${nameCategory}</p></a></li>`;
                } else {
                    elementCategorys.innerHTML += `<li class="liShop" id="category${nameCategory}Li"><a href="#" class="button buttonShop" id="category${nameCategory}" title="clique para acessar a categoria ${nameCategory}"><img src="${imageCategory}" alt="icone ${nameCategory}"> <p class="textCategoryShop">${nameCategory}</p></a></li>`;
                }
            }

            const categorySelected = document.getElementById("categorySelectedText");
            categorySelected.textContent = "Visualizando " + document.getElementById("allShopButton").querySelector(".textCategoryShop").textContent;

            document.addEventListener("click", async (e) => {
                const target = e.target;
                if (target.id === "menuShopShowing") {
                    e.preventDefault();
                    document.getElementById("ulCategoryShop").style.width = "fit-content";
                    const elements = document.getElementsByClassName("buttonShop");
                    const texts = document.getElementsByClassName("textCategoryShop");
                    if (target.classList.contains("menuShowing")) {
                        menuIsShowing = false;
                        target.classList.remove("menuShowing");
                        for (let i = 0; i < elements.length; i++) {
                            elements[i].classList.remove("menuShowing");
                        }
                        for (let i = 0; i < texts.length; i++) {
                            texts[i].style = undefined;
                        }
                    } else {
                        menuIsShowing = true;
                        document.getElementById("ulCategoryShop").style.width = "30rem";
                        for (let i = 0; i < elements.length; i++) {
                            elements[i].classList.add("menuShowing");
                        }
                        for (let i = 0; i < texts.length; i++) {
                            texts[i].style.display = "unset";
                        }
                        target.classList.add("menuShowing");
                    }
                    return;
                }
                if (target.classList.contains("buttonShop")) {
                    e.preventDefault();
                    const categorySelected = document.getElementById("categorySelectedText");
                    scrollToElement(categorySelected);
                    const category = target.querySelector(".textCategoryShop").textContent
                    categorySelected.textContent = "Visualizando " + category;
                    const items = config["items"];
                    let subcategorys = [];
                    for (let ct in categorys) {
                        if (String(categorys[ct]["subcategory"]).toLowerCase() === String(category).toLowerCase()) {
                            subcategorys.push(String(ct).toLowerCase());
                        }
                    }
                    for (let item in items) {
                        const element = document.getElementById(`itemCard${item}`);
                        element.style.display = "unset";
                        if (category == "todos") continue;
                        if (!element.classList.contains(`categoryCard${category}`)) {
                            element.style.display = "none";
                        }
                        if (subcategorys.length > 0) {
                            for (let i = 0; i < subcategorys.length; i++) {
                                const subcategory = subcategorys[i];
                                if (element.classList.contains(`categoryCard${subcategory}`) || element.classList.contains(`categoryCard${category}`)) {
                                    element.style.display = "unset";
                                }
                            }
                        }
                    }
                }
            });

            const elementsLi = document.getElementsByClassName("liShop");
            for (let i = 0; i < elementsLi.length; i++) {
                const li = elementsLi[i];
                li.addEventListener("mouseenter", (e) => {
                    const target = e.target;
                    if (target.classList.contains("liShop")) {
                        const a = target.querySelector("a");
                        const nameCategory = String(a.id).replace("category", "");
                        if (!categorys[nameCategory]) return;
                        let div;
                        for (let item in categorys) {
                            if (categorys[item] && categorys[item]["subcategory"] && categorys[item]["subcategory"] === nameCategory) {
                                if (!div) {
                                    div = document.createElement("div");
                                    div.classList.add("subcategorysShop");
                                }
                                const span = document.createElement("a");
                                span.href = "#";
                                span.classList.add("buttonShop");
                                span.classList.add("button");
                                span.classList.add("menuShowing");
                                const element = document.getElementById("category" + item);
                                span.innerHTML += element.innerHTML;
                                span.querySelector(".textCategoryShop").style.display = "unset";
                                div.appendChild(span);
                            }
                        }
                        if (div) {
                            if (!menuIsShowing) {
                                a.classList.add("selectedButton");
                                const p = a.querySelector(".textCategoryShop");
                                p.style.display = "unset";
                            }
                            target.appendChild(div);
                        }
                    }
                });
                li.addEventListener("mouseleave", (e) => {
                    let target = e.target;
                    if (target.classList.contains("liShop")) {
                        const a = target.querySelector("a");
                        target = document.getElementById(target.id);
                        const elements = target.getElementsByClassName("subcategorysShop");
                        if (elements.length > 0) {
                            if (!menuIsShowing) {
                                a.classList.remove("selectedButton");
                                const p = a.querySelector(".textCategoryShop");
                                p.style = undefined;
                            }
                            for (let i = 0; i < elements.length; i++) {
                                target.removeChild(elements[i]);
                            }
                        }
                    }
                });
            }

            const containerItemViewers = document.getElementById("containerItemViewers");
            const items = config["items"];
            for (let item in items) {
                const category = items[item]["category"];
                const title = items[item]["title"];
                const description = items[item]["description"];
                const price = formatValue(Number(items[item]["price"]));
                const image = items[item]["image"];
                const htmlItem = `
                <div id="itemCard${item}" class="containerViewer categoryCard${category}">
                    <div class="itemCard">
                        <img src="${image}" alt="imagem do item ${item}" class="imgCard">
                        <h2 class="titleCard">${title}</h2>
                        <p class="priceCard">${price}</p>
                        <a href="#" class="buttonBuy button"><img src="../assets/imgs/shopping-cart.png"
                                alt="">
                            <p>comprar</p>
                        </a>
                        <article class="descriptionCard">${description}</article>
                        <img src="../assets/imgs/info.png" alt="imagem ilustrativa do item"
                            class="imgInfoCard">
                    </div>
                </div>
                `
                containerItemViewers.innerHTML += htmlItem;
            }

            // adicionando evento para ver as descrições dos item(s).
            const elementsCards = document.getElementsByClassName("containerViewer");
            for (let i = 0; i < elementsCards.length; i++) {
                const element = elementsCards[i];
                element.addEventListener("mouseenter", (e) => {
                    const target = e.target;
                    const description = target.querySelector(".descriptionCard");
                    description.style.display = "unset";
                    const info = target.querySelector(".imgInfoCard");
                    info.style.display = "none";
                });
                element.addEventListener("mouseleave", (e) => {
                    const target = e.target;
                    const description = target.querySelector(".descriptionCard");
                    description.style.display = "none";
                    const info = target.querySelector(".imgInfoCard");
                    info.style.display = "unset";
                });
            }

        }
    } catch (e) {
        console.log("Ocorreu um erro ao tentar conectar a API. " + e.message);
        window.target = "./index.html";
    }

});

function scrollToElement(element) {
    const rect = element.getBoundingClientRect();
    const offsetTop = window.scrollY + rect.top + (-rect.height * 2.05);

    // Realiza o scroll até a posição calculada
    window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
    });
}

function formatValue(value) {
    const formattedAmount = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
    return formattedAmount;
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}