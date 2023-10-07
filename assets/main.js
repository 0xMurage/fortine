window.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('#submitBtn');
    const fileInput = document.querySelector('#fileInput');
    const displaySection = document.querySelector('#displaySection');
    const widthInput = document.querySelector('#width');
    const heightInput = document.querySelector('#height');

    submitBtn.addEventListener('click', () => {
        if (!fileInput.files?.length) {
            return;
        }
        displaySection.innerHTML = '';

        const qrCodeOptions ={
            width: parseInt(widthInput.value) || 300,
            height: parseInt(heightInput.value) || 300
        }

        Papa.parse(fileInput.files[0], {
            header: true,
            step: function (results, parser) {
                if (results.data) {
                    const cardContainer = document.createElement('div');
                    cardContainer.classList.add('col-md-4', 'col-lg-3', 'p-2')
                    const card = processRow(results.data, qrCodeOptions);
                    cardContainer.append(card);
                    displaySection.append(cardContainer);
                }
            },
        })
    });

    function processRow(data, qrCodeOptions) {

        let meCard = `MECARD:`
        let vCard = `BEGIN:VCARD\nVERSION:4.0\n`

        const card = document.createElement('card');
        card.classList.add('card')

        const userInfoContainerElem = document.createElement('ul');
        userInfoContainerElem.classList.add('list-group', 'list-group-flush','border-top','mt-1');

        for (const key in data) {
            const x = key.toLowerCase();
            if (x.includes('name') || x.includes('phone') || x.includes('email')) {
                const li = document.createElement('li');
                li.classList.add('list-group-item')
                li.textContent = data[key];
                userInfoContainerElem.append(li);
            }

            // meCard += formatMeCardValue(key, data[key]);
            vCard += formatVCardValue(key, data[key]);
        }


        meCard += `;`;
        vCard += `\nEND:VCARD`;

        const qrCodeContainer = document.createElement('div');
        qrCodeContainer.classList.add('d-flex', 'justify-content-center', 'card-img-top','mt-2')

        new QRCode(qrCodeContainer, Object.assign({
            text:vCard,
        }, qrCodeOptions));

        card.append(qrCodeContainer)

        card.append(userInfoContainerElem)
        return card;
    }

    function formatMeCardValue(header, value) {
        const prefixes = {
            name: 'N:',
            email: 'EMAIL:',
            phone: 'TEL:',
            website: 'URL:',
            address: 'ADR:',
            note: 'NOTE:',
        }

        const key = Object.keys(prefixes).find((key) => header.toLowerCase().includes(key));

        if (key) {
            return prefixes[key] + value + ';';
        }
        return '';
    }

    function formatVCardValue(header, value) {
        const prefixes = {
            name: 'N:',
            'personal email': '\nEMAIL:',
            'work email': '\nEMAIL;TYPE=work:',
            phone: '\nTEL:',
            website: '\nURL:',
            address: '\nADR;',
            note: '\nNOTE:',
            title: '\nTITLE:',
            company: '\nORG:'
        }

        const key = Object.keys(prefixes).find((key) => header.toLowerCase().includes(key));

        if (key) {
            return prefixes[key] + value;
        }
        return '';
    }
})