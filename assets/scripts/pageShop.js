let shopSelected;
let config, categorys;
document.addEventListener("DOMContentLoaded", async (e) => {

    // dando fetch nas categorias da config.
    const elementCategorys = document.getElementById("ulCategoryShop");
    try {
        const response = await fetch('http://localhost:3000/config');
        if (response.ok) {
            config = await response.json();
            categorys = config["categorys"];

            for (let item in categorys) {
                console.log("item renderizado " + item);
                const nameCategory = item;
                const imageCategory = categorys[nameCategory]["image"];
                const subcategory = categorys[nameCategory]["subcategory"];
                if (subcategory && Object.keys(categorys).includes(subcategory)) {
                    elementCategorys.innerHTML += `<li class="liShop" id="category${nameCategory}Li"><a href="#" class="button buttonShop hidden" id="category${nameCategory}" title="clique para acessar a categoria ${nameCategory}"><img src="${imageCategory}" alt="icone ${nameCategory}"> <p class="textCategoryShop">${nameCategory}</p></a></li>`;
                } else {
                    elementCategorys.innerHTML += `<li class="liShop" id="category${nameCategory}Li"><a href="#" class="button buttonShop" id="category${nameCategory}" title="clique para acessar a categoria ${nameCategory}"><img src="${imageCategory}" alt="icone ${nameCategory}"> <p class="textCategoryShop">${nameCategory}</p></a></li>`;
                }
            }

            shopSelected = document.getElementById("allShopButton");
            shopSelected.classList.add("selectedButton");

            document.addEventListener("click", async (e) => {
                const target = e.target;
                if (target.id === "menuShopShowing") {
                    e.preventDefault();
                    document.getElementById("ulCategoryShop").style.width = "fit-content";
                    const elements = document.getElementsByClassName("buttonShop");
                    const texts = document.getElementsByClassName("textCategoryShop");
                    if (target.classList.contains("menuShowing")) {
                        target.classList.remove("menuShowing");
                        for (let i = 0; i < elements.length; i++) {
                            elements[i].classList.remove("menuShowing");
                        }
                        for (let i = 0; i < texts.length; i++) {
                            texts[i].style = undefined;
                        }
                    } else {
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
                    if (target !== shopSelected) {
                        shopSelected.classList.remove("selectedButton");
                        shopSelected = target;
                        shopSelected.classList.add("selectedButton");
                    }
                }
            });

            const elementsLi = document.getElementsByClassName("liShop");
            for (let i = 0; i < elementsLi.length; i++) {
                const li = elementsLi[i];
                li.addEventListener("mouseenter", (e) => {
                    const target = e.target;
                    if (target.classList.contains("liShop")) {
                        console.log("Entrou");
                        const nameCategory = String(target.querySelector("a").id).replace("category", "");
                        console.log(nameCategory);
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
                                const element = document.getElementById("category" + item);
                                span.innerHTML += element.innerHTML;
                                div.appendChild(span);
                            }
                        }
                        if (div) {
                            target.appendChild(div);
                        }
                    }
                });
                li.addEventListener("mouseleave", (e) => {
                    let target = e.target;
                    if (target.classList.contains("liShop")) {
                        console.log("saiu!");
                        target = document.getElementById(target.id);
                        const elements = target.getElementsByClassName("subcategorysShop");
                        for (let i = 0; i < elements.length; i++) {
                            target.removeChild(elements[i]);
                        }
                    }
                });
            }
        }
    } catch (e) {
        console.log("Ocorreu um erro ao tentar conectar a API. " + e.message);
        window.target = "./index.html";
    }

});