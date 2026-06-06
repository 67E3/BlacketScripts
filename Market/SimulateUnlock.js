(async () => {
    let blookInput = prompt("Enter the name of the blook you want to simulate unlocking:");
    if (!blookInput) return;

    let matchedBlook = Object.keys(blacket.blooks).find(b => b.toLowerCase() === blookInput.toLowerCase());
    if (!matchedBlook) {
        alert("Blook not found!");
        return;
    }

    let blookData = blacket.blooks[matchedBlook];
    
    let packName = blookData.pack;
    if (!packName) {
        for (let p in blacket.packs) {
            if (blacket.packs[p].blooks && blacket.packs[p].blooks.includes(matchedBlook)) {
                packName = p;
                break;
            }
        }
    }
    if (!packName) packName = "Bot";

    let packData = blacket.packs[packName] || { color1: "#000000", color2: "#333333", image: "/content/packs/art/Default.webp" };

    let chance = blookData.chance || 100;
    let blookName = `${chance}% - NEW!`;

    let blookArt = blookData.art || "/content/packs/art/Default.webp";
    let backgroundId = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 16);

    $(".arts__modal___VpEAD-camelCase").remove();

    $("body").attr("style", "overflow: hidden;");
    $("body").append(`
        <div id="${backgroundId}" class="styles__openBackground___-U4oX-camelCase" style="background: radial-gradient(circle, ${packData.color1} 0%, ${packData.color2} 100%);">
            <div class="styles__openContainer___3paFG-camelCase">
                <img loading="lazy" src="${blookArt}" class="styles__blookBackground___3rt4N-camelCase" draggable="false">
                <div class="styles__blookContainer___36LK2-camelCase styles__unlockedBlookImage___wC4gr-camelCase">
                    <img loading="lazy" src="${blookData.image}" draggable="false" class="styles__blook___1R6So-camelCase" />
                </div>
                <div class="styles__unlockedText___1diat-camelCase">
                    <div class="styles__unlockedBlook___2pr1Z-camelCase" style="font-size: 2.031vw;">
                        <div style="display: block; white-space: nowrap; font-family: Puffet;">${matchedBlook}</div>
                    </div>
                    <div class="styles__rarityText___1PfSA-camelCase" style="color: ${blacket.rarities[blookData.rarity].color};">${blookData.rarity}</div>
                </div>
                <div class="styles__bottomText___3_k10-camelCase">${blookName}</div>
                <div class="styles__bottomShadow___10ZLG-camelCase"></div>
            </div>
            <div class="styles__openPackContainer___2m4Yf-camelCase" role="button" tabindex="0">
                <div style="transform: rotate(0deg);">
                    <img loading="lazy" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-width: 16.406vw; object-fit: cover; height: 15.625vw; object-position: bottom; margin-top: 1.094vw;" src="${packData.image}">
                    <div class="styles__openPack___3QxCP-camelCase" style="background-image: url('/content/packSeelOpen.webp'); transform: scale(0.99);"></div>
                </div>
            </div>
            <div class="styles__openBigButton___3KmDM-camelCase styles__canOpen___2znG2-camelCase" role="button" tabindex="0"></div>
        </div>
    `);

    $(".styles__openBigButton___3KmDM-camelCase").click(function() {
        $(this).unbind("click");
        $(".styles__openPackContainer___2m4Yf-camelCase").attr("class", "styles__openingPackContainer___1ZQzY-camelCase");
        $(".styles__openPack___3QxCP-camelCase").attr("class", "styles__openPack___3QxCP-camelCase styles__isOpeningPack___1qY5t-camelCase");
        $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainer___2OmG9-camelCase");
        
        let animationType = blacket.rarities[blookData.rarity].animation;
        if (animationType === "epic") $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainerEpic___3TzCR-camelCase");
        else if (animationType === "legendary") $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainerLegendary___RbJZ_-camelCase");
        else if (animationType === "chroma" || animationType === "mystical") $(".styles__openContainer___3paFG-camelCase").addClass("styles__openingContainerChroma___3VBd5-camelCase");

        setTimeout(() => { $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(1deg);"); }, 270);
        setTimeout(() => { $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(2deg);"); }, 300);
        setTimeout(() => { $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(2.5deg);"); }, 330);
        setTimeout(() => { $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1)").attr("style", "transform: rotate(0deg);"); }, 410);
        setTimeout(() => { $(".styles__openingPackContainer___1ZQzY-camelCase > div:nth-child(1) > img:nth-child(1)").remove(); }, 650);

        if (blacket.rarities[blookData.rarity].color === "rainbow") {
            $(".styles__rarityText___1PfSA-camelCase").attr("class", "styles__rarityText___1PfSA-camelCase rainbow");
            $(".styles__rarityText___1PfSA-camelCase").attr("style", `color: ${blacket.rarities[blookData.rarity].color}; text-shadow: 0 0 52.083vw black;`);
        }

        setTimeout(() => {
            if (typeof Phaser !== "undefined") {
                let config = {
                    type: Phaser.WEBGL,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    parent: document.getElementById(backgroundId),
                    render: { transparent: true },
                    scene: {
                        preload: function() {
                            for (let i = 1; i <= 7; i++) {
                                this.load.image(i.toString(), `/content/particles/${i}.webp`);
                            }
                        },
                        create: function() {
                            let emitters = [];
                            let tintColor = parseInt(blacket.rarities[blookData.rarity].color.replace("#", "").substring(0, 6), 16);
                            
                            for (let i = 1; i <= 7; i++) {
                                let particle = this.add.particles(i.toString());
                                let emitterConfig = {
                                    scale: 0.25,
                                    speed: { min: 700, max: 800 },
                                    angle: animationType === "rare" ? { min: -70, max: -20 } : { min: -115, max: -65 },
                                    velocity: { min: 600, max: 750 },
                                    rotate: {
                                        onEmit: () => 0,
                                        onUpdate: (p) => p.angle + 1
                                    },
                                    gravityY: animationType === "rare" ? 500 : 700,
                                    frequency: 75,
                                    tint: tintColor,
                                    lifespan: 5000,
                                    x: animationType === "rare" ? { min: -25, max: 25 } : { min: window.innerWidth / 2 - 25, max: window.innerWidth / 2 + 25 },
                                    y: animationType === "rare" ? window.innerHeight : window.innerHeight / 2 + 25
                                };
                                if (animationType !== "rare") emitterConfig.velocityFromRotation = true;
                                
                                emitters.push(particle.createEmitter(emitterConfig));
                            }

                            setTimeout(() => {
                                emitters.forEach(e => e.stop());
                            }, 1500);
                        }
                    }
                };
                new Phaser.Game(config);
            }

            $(`#${backgroundId}`).click(() => {
                $(`#${backgroundId}`).remove();
                $("body").removeAttr("style");
            });
        }, 1000);
    });
})();
