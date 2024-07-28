const getClient = async(id) => {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`);
    const objectArray = await response.json();
    return objectArray;
}

const createClientPage = async () => {
    const pageSearch = new URLSearchParams(location.search);
    const pageId = pageSearch.get('id');
    const clientInfo = await getClient(pageId);
    const idTitle = document.querySelector('.id-title');
    const fio = document.querySelector('.fio');
    idTitle.textContent = `ID Клиента - ${clientInfo.id}`;
    fio.textContent = `${clientInfo.name} ${clientInfo.surname} ${clientInfo.lastName}`;
    const contactList = document.querySelector('.contacts-list');
    clientInfo.contacts.forEach(contact => {
        const contactType = contact.type;
        const contactValue = contact.value;
        const typeColumn = document.createElement('div');
        const valueColumn = document.createElement('div');
        const contactRow = document.createElement('div');
        contactRow.classList.add('contact-row', 'flex');
        typeColumn.classList.add('type-column');
        valueColumn.classList.add('value-column');
        contactRow.appendChild(typeColumn);
        contactRow.appendChild(valueColumn);
        typeColumn.textContent = `${contactType}`;
        valueColumn.textContent = `${contactValue}`;
        contactList.appendChild(contactRow);
    })
}

createClientPage();