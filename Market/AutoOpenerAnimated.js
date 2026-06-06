(async () => {
    let packInput = prompt("Enter the pack name (e.g., Space):");
    if (!packInput) return;

    let matchedPack = Object.keys(blacket.packs).find(p => p.toLowerCase() === packInput.toLowerCase());
    if (!matchedPack) {
        alert("Pack not found!");
        return;
    }

    let packPrice = blacket.packs[matchedPack].price;
    let maxCanOpen = Math.floor(blacket.user.tokens / packPrice);

    let amountInput = prompt(`How many packs do you want to open?\nMax you can open: ${maxCanOpen}`);
    let amount = parseInt(amountInput);
    if (isNaN(amount) || amount <= 0) return;
    if (amount > maxCanOpen) {
        alert("You do not have enough tokens!");
        return;
    }

    for (let i = 0; i < amount; i++) {
        await new Promise((resolve) => {
            blacket.openPack(matchedPack);

            let checkInterval = setInterval(() => {
                let openButton = $(".styles__openBigButton___3KmDM-camelCase");
                if (openButton.length > 0) {
                    clearInterval(checkInterval);

                    let blookName = $(".styles__unlockedBlook___2pr1Z-camelCase div").text();
                    let rarityText = $(".styles__rarityText___1PfSA-camelCase").text();
                    
                    let matchedBlook = Object.keys(blacket.blooks).find(b => b.toLowerCase() === blookName.toLowerCase());
                    let color = "#ffffff";
                    if (matchedBlook && blacket.blooks[matchedBlook]) {
                        let rarityInfo = blacket.rarities[blacket.blooks[matchedBlook].rarity];
                        if (rarityInfo) color = rarityInfo.color;
                    }

                    console.log(
                        `%cUnlocked: ${blookName} (${rarityText})`,
                        `color: ${color}; font-weight: bold; font-size: 16px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8);`
                    );

                    openButton.click();

                    setTimeout(() => {
                        let closeInterval = setInterval(() => {
                            let background = $(".styles__openBackground___-U4oX-camelCase");
                            if (background.length > 0) {
                                background.click();
                            } else {
                                clearInterval(closeInterval);
                                setTimeout(resolve, 200);
                            }
                        }, 100);
                    }, 1000);
                }
            }, 100);
        });
    }

    blacket.createToast({
        title: "Session Finished",
        message: `Completed auto-opening sequence for ${amount} packs!`,
        icon: blacket.packs[matchedPack].image,
        time: 5000
    });
})();
