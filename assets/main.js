window.addEventListener('DOMContentLoaded', () => {
    console.log('++++',)

    const uploadForm = document.querySelector('#uploadForm');
    const submitBtn = document.querySelector('#submitBtn');
    const fileInput = document.querySelector('#fileInput');
    const displaySection = document.querySelector('#displaySection');

    submitBtn.addEventListener('click', () => {
        if (!fileInput.files?.length) {
            return;
        }
        const table = document.createElement('table');
        table.classList.add('table')
        Papa.parse(fileInput.files[0], {
            step: function (results, parser) {
                if (results.data?.length) {
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
        const tr = document.createElement('tr');
        for (const k of data) {
            const td = document.createElement('td');
            td.innerHTML = k;
            tr.append(td)
        }
        const td = document.createElement('td');
        const div = document.createElement('div');
        td.append(div);
        new QRCode(div, data.join('\n'));

        tr.append(td)
        return tr;
    }

})