window.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.querySelector('#submitBtn');
    const fileInput = document.querySelector('#fileInput');
    const displaySection = document.querySelector('#displaySection');

    submitBtn.addEventListener('click', () => {
        if (!fileInput.files?.length) {
            return;
        }
        displaySection.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('table')

        Papa.parse(fileInput.files[0], {
            header: true,
            step: function (results, parser) {
                if (results.data) {
                    const row = processRow(results.data);
                    table.append(row);
                }
            },
            complete: function () {
                displaySection.append(table);
                displaySection.classList.remove('d-none');
            }
        })
    });

    function processRow(data) {

        let meCard = `MECARD:`

        const tr = document.createElement('tr');

        for (const key in data) {
            const td = document.createElement('td');
            td.innerHTML = data[key];
            tr.append(td);

            meCard += formatMeCardValue(key, data[key]);
        }

        meCard += `;`;

        const td = document.createElement('td');
        const div = document.createElement('div');
        td.append(div);

        new QRCode(div, meCard);

        tr.append(td)
        return tr;
    }

    function formatMeCardValue(header, value) {
        const prefixes = {
            name: 'N:',
            email: 'EMAIL:',
            phone: 'TEL:',
            website: 'URL:',
            address: 'ADR:',
            note: 'ADR:NOTE',
        }

        const key = Object.keys(prefixes).find((key) => header.toLowerCase().includes(key));

        if (key) {
            return prefixes[key] + value;
        }
        return '';
    }
})