document.addEventListener("DOMContentLoaded", () => {

    document.addEventListener("click", async (e) => { // criando evento de selecionar qual botão da wiki e exibir o conteúdo desejado de cada botão.
        if (e.target.classList.contains("selectedButtonWiki")) {
            e.preventDefault();
            return;
        }
        if (!e.target.classList.contains("buttonWiki")) return;
        let lastTarget = document.getElementsByClassName("selectedButtonWiki")[0];
        lastTarget.classList.remove("selectedButtonWiki");

        let newTarget = e.target;
        newTarget.classList.add("selectedButtonWiki");

        let lastContainer = document.getElementsByClassName("containerSelectedWiki")[0];
        lastContainer.style.display = "none"
        lastContainer.classList.remove("containerSelectedWiki");

        let newContainer;
        switch (newTarget.id) {
            case "breedWiki":
                newContainer = document.getElementById("containerBreeds");
                break;
            case "terrenosWiki":
                newContainer = document.getElementById("containerTerrenos");
                break;
            case "caixasWiki":
                newContainer = document.getElementById("containerCaixas");
                break;
            case "pokeluckysWiki":
                newContainer = document.getElementById("containerPokeluckys");
                break;
            default:
                break;
        }
        newContainer.classList.add("containerSelectedWiki");
        newContainer.style.display = "unset";

    })

});