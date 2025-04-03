let clickedIp = false;
let selectedButton;

document.addEventListener("DOMContentLoaded", async (e) => {
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("button_term")) { // clicando nos termos de uso
            e.preventDefault();
            executeTerms();
            return;
        }
        if ((e.target.id === "wikiButton" ||
            e.target.id === "shopButton") && e.target !== selectedButton) {
            e.preventDefault();
            if (selectedButton) {
                selectedButton.classList.remove("selectedButton");
            }
            selectedButton = e.target;
            selectedButton.classList.add("selectedButton");

            const container = document.getElementsByClassName("selected")[0];
            container.classList.remove("selected");
            switch (selectedButton.id) {
                case "wikiButton":
                    document.getElementsByClassName("container")[1].classList.add("selected");
                    break;
                case "shopButton":
                    document.getElementsByClassName("container")[0].classList.add("selected");
                    break;
                default:
                    break;
            }
            window.scrollTo(0,0);
            return;
        }
        if (e.target.id === "buttonIp") {
            e.preventDefault();
            const target = e.target.querySelector("p");
            if (clickedIp) return;
            clickedIp = true;
            const elementText = target;
            const texto = elementText.textContent;
            navigator.clipboard.writeText(texto.replace('IP:', '')).then(() => {
                elementText.textContent = 'copiado com sucesso!'
                setTimeout(() => {
                    elementText.textContent = texto;
                    clickedIp = false;
                }, 800);
            }).catch((err) => {
                elementText.textContent = 'erro ao copiar!!'
                setTimeout(() => {
                    elementText.textContent = texto;
                    clickedIp = false;
                }, 800);
            });
        }
    });

    selectedButton = document.getElementById("shopButton");
    selectedButton.classList.add("selectedButton");

    await executeListPlayers(document.getElementsByClassName("containerPlayers")[0]);
});

async function executeListPlayers(element) {

    let result = await fetch("http://localhost:3000/topPlayers");
    if (!result) return;

    const data = await result.json();
    if (!data) return;
    if (data.length === 0) return;

    let seconds = 0.5;
    for(let obj of data) {
        let [nick, time] = obj.split('>');
        const html = `
        <div class="playerCard">
            <h2>${nick}</h2>
            <p>${time}</p>
            <img loading="lazy" src="https://mc-heads.net/body/${nick}" alt="imagem player">
        </div>
        `;
        element.insertAdjacentHTML("beforeend", html);

        const elementPlayers = document.getElementsByClassName("playerCard");
        const playerCard = elementPlayers[elementPlayers.length - 1];
        playerCard.style.animation = `slideUp ${seconds}s ease forwards, fadeIn 3s ease forwards`;

        if (seconds < 3) seconds += 0.5;
    }
}

function executeTerms() {
    let containerTerms = document.getElementById("containerTerms");
    containerTerms.style = undefined;
}