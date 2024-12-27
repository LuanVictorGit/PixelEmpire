let clickedIp = false;
let selectedButton;

document.addEventListener("DOMContentLoaded", async (e) => {
    document.addEventListener("click", (e) => {
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
    const html = `
        <div class="playerCard">
            <h2>lHawk_</h2>
            <p>10.000 pixelcoins</p>
            <img loading="lazy" src="https://crafatar.com/renders/body/ee0138d1-9707-4ee3-8095-1e96db15c454" alt="imagem player">
        </div>
    `;
    let seconds = 0.25;
    for (let i = 0; i < 10; i++) {
        // Adiciona o novo playerCard ao container sem sobrescrever o conteúdo
        element.insertAdjacentHTML("beforeend", html);

        // Seleciona o novo playerCard
        const elementPlayers = document.getElementsByClassName("playerCard");
        const playerCard = elementPlayers[elementPlayers.length - 1];

        // Aplica a animação ao playerCard
        playerCard.style.animation = `slideUp ${seconds}s ease forwards, fadeIn 3s ease forwards`;

        // Aumenta o tempo da animação gradualmente
        if (seconds < 3) seconds += 0.25;
    }
}