let shopSelected;
document.addEventListener("DOMContentLoaded", async (e) => {

    document.addEventListener("click", async (e) => {
        const target = e.target;
        if (target.classList.contains("buttonShop")){
            e.preventDefault();
            if (target !== shopSelected) {
                shopSelected.classList.remove("selectedButton");
                shopSelected = target;
                shopSelected.classList.add("selectedButton");
            }
        }
    });

    shopSelected = document.getElementsByClassName("buttonShop")[0];
    shopSelected.classList.add("selectedButton");

});