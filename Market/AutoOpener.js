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

    let originalOpenPack = blacket.openPack;

    for (let i = 0; i < amount; i++) {
        await new Promise((resolve) => {
            blacket.user.tokens = blacket.user.tokens - packPrice;
            $("#tokenBalance > div:nth-child(2)").html(blacket.user.tokens.toLocaleString());
            $(".arts__modal___VpEAD-camelCase").remove();

            blacket.requests.post("/worker3/open", { pack: matchedPack }, (data) => {
                if (data.error) {
                    blacket.user.tokens = blacket.user.tokens + packPrice;
                    $("#tokenBalance > div:nth-child(2)").html(blacket.user.tokens.toLocaleString());
                    resolve();
                    return;
                }

                if (!blacket.user.blooks[data.blook]) {
                    blacket.user.blooks[data.blook] = 1;
                } else {
                    blacket.user.blooks[data.blook]++;
                }

                let rarityInfo = blacket.rarities[blacket.blooks[data.blook].rarity];
                let color = rarityInfo ? rarityInfo.color : "#ffffff";

                console.log(
                    `%cUnlocked: ${data.blook}`,
                    `color: ${color}; font-weight: bold; font-size: 14px; text-shadow: 1px 1px 2px black;`
                );

                resolve();
            });
        });
    }

    blacket.createToast({
        title: "Finished",
        message: `Successfully opened ${amount} ${matchedPack} packs! Check console for results.`,
        icon: blacket.packs[matchedPack].image,
        time: 5000
    });
})();
