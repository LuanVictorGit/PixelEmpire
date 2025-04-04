import { formatValue, config } from "./pageShop.js";

let htmlContainerProductInfoBuyDefault;
let selectedItemID;
document.addEventListener("DOMContentLoaded", () => {

    htmlContainerProductInfoBuyDefault = document.getElementsByClassName("containerProductInfoBuy")[0].innerHTML;

    document.addEventListener("click", async (e) => {
        const target = e.target;
        if (target.classList.contains("closeMenu")) {
            e.preventDefault();
            const containerMenuBuy = document.getElementById("containerMenuBuy");
            const containerTerms = document.getElementById("containerTerms");
            if (containerTerms && !containerTerms.style.display) {
                containerTerms.style.display = "none";
                return;
            }
            if (containerMenuBuy && !containerMenuBuy.style.display) {
                containerMenuBuy.style.display = "none";
            }
            return;
        }
        if (target.closest(".containerViewer")) { // evento de clicar no card.
            e.preventDefault();

            document.getElementsByClassName("containerProductInfoBuy")[0].innerHTML = htmlContainerProductInfoBuyDefault;

            const container = target.closest(".containerViewer");
            const idItem = container.id.replace("itemCard", "");
            const containerMenuBuy = document.getElementById("containerMenuBuy");
            document.getElementById("formBuy").reset();
            containerMenuBuy.style = undefined;
            selectedItemID = idItem;

            const itemName = config["items"][idItem]["title"];

            const labelNameItem = containerMenuBuy.querySelector(".product-name");
            labelNameItem.textContent = itemName;

            const price = Number(config["items"][idItem]["price"]);
            const priceItem = containerMenuBuy.querySelector(".price span");
            priceItem.textContent = formatValue(price);

            const imgItem = containerMenuBuy.querySelector(".product-info img");
            imgItem.src = config["items"][idItem]["image"];

            document.getElementById("quantity").value = 1;

            return;
        }
        if (target.id === "confirmBuy") {
            e.preventDefault();
            if (!selectedItemID) return;
            const nick = document.getElementById("nick");
            if (!nick.value) {
                alert("Coloque o seu nick antes de confirmar a compra!");
                return;
            }
            let nickValue = sanitizeInput(nick.value.trim());
            let quantity = Number(document.getElementById("quantity").value);
            quantity = quantity < 0 ? 1 : quantity > 10 ? 10 : quantity;
            const containerProductInfoBuy = document.getElementsByClassName("containerProductInfoBuy")[0];
            containerProductInfoBuy.innerHTML = `<div style="
    width: 7rem;
    height: 7rem;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
    ">
    </div>`;
            //document.getElementsByClassName("closeMenu")[0].click(); // fechando o menu
            const response = await fetch("http://localhost:3000/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nick: nickValue,
                    title: String(config["items"][selectedItemID]["title"]),
                    quantity: quantity,
                    unit_price: Number(config["items"][selectedItemID]["price"]),
                    selectedItemID: selectedItemID
                })
            });
            if (!response.ok) {
                alert("Não foi possivel gerar o link de pagamento.");
                return;
            }
            const json = (await response.json()).response;
            const name = String(config["items"][selectedItemID]["title"]).toUpperCase();
            const pricePix = json["transactionAmount"];
            const pixKey = json["pointOfInteraction"]["transactionData"]["qrCode"];
            const qrcode64 = json["pointOfInteraction"]["transactionData"]["qrCodeBase64"];
            const htmlContainerProductInfoBuy = `
            <div class="payment-container">
                <h1>Realizando o pagamento da compra</h1>
                <p><strong>Item:</strong> ${name}</p>
                <p><strong>Preço:</strong> ${formatValue(pricePix)}</p>
                <div class="qrcode">
                    <img src="data:image/jpeg;base64,${qrcode64}" alt="QR Code Pix">
                </div>
                <div class="pix-key" id="pixKey">${pixKey}</div>
                <!--<button class="copy-button"">Copiar Chave Pix</button>-->
            </div>
            `;
            containerProductInfoBuy.innerHTML = htmlContainerProductInfoBuy;
            return;
        }
    });

    document.addEventListener("input", (e) => {
        const target = e.target;
        if (target.id === "nick"){
            target.value = sanitizeInput(target.value);
            return;
        }
        if (target.id !== "quantity") return;
        let value = target.value;
        value = value.replace(/[^\d]/g, '');
        if (value > 10) {
            value = target.max;
        }
        target.value = value;
        if (!selectedItemID) return;
        const quantity = Number(target.value);
        const containerMenuBuy = document.getElementById("containerMenuBuy");
        const priceItem = containerMenuBuy.querySelector(".price span");
        const idItem = selectedItemID;
        if (config["items"][idItem]) {
            const price = Number(config["items"][idItem]["price"]);
            const totalPrice = price * quantity;
            priceItem.textContent = formatValue(totalPrice);
        }
    });
});

function sanitizeInput(input) {
    // Remove tags HTML
    input = input.replace(/<[^>]*>?/gm, '');

    // Permite letras, números, espaços, underscores e pontos
    input = input.replace(/[^a-zA-Z0-9\s_\.]/g, '');

    // Remove espaços em branco no início e no final (trim)
    input = input.trim();

    // Remove espaços em branco extras no meio (opcional)
    input = input.replace(/\s+/g, ' ');

    return input;
}