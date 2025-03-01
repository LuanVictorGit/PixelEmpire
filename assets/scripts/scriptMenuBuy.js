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
            if (containerMenuBuy) {
                containerMenuBuy.style.display = "none";
                return;
            }
            if (containerTerms) {
                containerTerms.style.display = "none";
            }
            return;
        }
        if (target.closest(".containerViewer")) {
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
            const quantity = Number(document.getElementById("quantity").value);
            const containerProductInfoBuy = document.getElementsByClassName("containerProductInfoBuy")[0];
            containerProductInfoBuy.innerHTML = `<div style="
    width: 15rem;
    height: 15rem;
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
                    nick: nick.value.trim(),
                    title: String(config["items"][selectedItemID]["title"]),
                    quantity: quantity,
                    unit_price: Number(config["items"][selectedItemID]["price"])
                })
            });
            if (!response.ok) {
                alert("Não foi possivel gerar o link de pagamento.");
                return;
            }
            const json = (await response.json()).response;
            const name = String(config["items"][selectedItemID]["title"]).toUpperCase();
            const pricePix = json["transaction_amount"];
            const pixKey = json["point_of_interaction"]["transaction_data"]["qr_code"];
            const qrcode64 = json["point_of_interaction"]["transaction_data"]["qr_code_base64"];
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
        if (target.id === "termsMenuBuy") {
            e.preventDefault();
            document.getElementsByClassName("closeMenu")[0].click(); // fechando o menu
        }
    });

    document.addEventListener("input", (e) => {
        const target = e.target;
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