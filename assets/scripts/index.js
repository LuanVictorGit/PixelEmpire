document.addEventListener("DOMContentLoaded", async (e) => {
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