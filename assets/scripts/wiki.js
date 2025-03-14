document.addEventListener("DOMContentLoaded", ()=>{

    document.addEventListener("click", async (e) => { //criando evento de selecionar qual botão da wiki.
        if (e.target.classList.contains("selectedButtonWiki")) {
            e.preventDefault();
            return;
        }
        if (!e.target.classList.contains("buttonWiki")) return;
        let lastTarget = document.getElementsByClassName("selectedButtonWiki")[0];
        lastTarget.classList.remove("selectedButtonWiki");

        let newTarget = e.target;
        newTarget.classList.add("selectedButtonWiki");
    })

});