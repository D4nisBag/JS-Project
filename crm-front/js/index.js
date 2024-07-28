//отправка клиентов
const addClient = async(data) => {
    const response = await fetch('http://localhost:3000/api/clients',{
        method: 'POST',
        body: data,
    })
    return await response.json();
}

//удаление клиента по его id
const deleteClient = async(id) => {
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: 'DELETE',
    })
    return await response.json();
}

const clientChangeAlert = document.querySelector('.client-change-modal__alert');
//функция изменения клиента
const changeClient = async (id, dataToSend) => {
    try {
      const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method: "PATCH",
        body: dataToSend,
      });
      
      const data = await response.json();
      if (response.ok) {
        if(!clientChangeAlert.classList.contains('disabled')) {
            clientChangeAlert.classList.add('disabled');
        }
        return await data;
      } else {
        clientChangeAlert.classList.remove('disabled');
        clientChangeAlert.textContent = `Ошибка: ${data.message}`;
        return { success: false, message: data.message };
      }
    } catch (error) {
        clientChangeAlert.classList.remove('disabled');
        clientChangeAlert.textContent = error.message;
        console.log(error.message);
      return { success: false, message: error.message};
    }
  };

let clientList;
const loading = document.querySelector('.main__loading-container');

//запрос на загрузку списка клиентов
const listRequest = async() => {
    const response = await fetch('http://localhost:3000/api/clients');
    const objectArray = await response.json();
    return objectArray;
}

//очистка списка клиентов
const deleteList = () => {
    const toDeleteList = document.querySelectorAll('.main__body-tr');
    toDeleteList.forEach(block => {
        block.remove();
    })
}

const refreshPage = async () => {
    deleteList();
    await returnClientsNames();
}

//селекторы для модального окна с потверждением удаления клиента
const clientDeleteConfirm = document.querySelector('.delete-client-confirm');
const clientDeleteConfirmContainer = document.querySelector('.delete-client-container');
const clientDeleteConfirmClose = document.querySelector('.delete-confirm__close');
const clientDeleteConfirmAgreeBtn = document.querySelector('.delete-confirm__confirm-btn');
let confirmStatus = false;
let toDeleteId;
let toChangeId;
const deleteClientConfirmContent = document.querySelector('.delete-confirm-content');
clientDeleteConfirmAgreeBtn.addEventListener('click', async ()=> {
    await deleteClient(toDeleteId);
    clientList = await listRequest();
    deleteList();
    setTimeout(async () => {
        await returnClientsNames();
        deleteClientConfirmContent.classList.remove('showmodal');
      }, 10);
      setTimeout(() => {
        clientDeleteConfirm.classList.add('disabled');
        toDeleteId = '';
    }, 700);
    toDeleteId = '';
})
let idSort = 0;
let nameSort = 0;
let createSort = 0;
let changeSort = 0;
let deleteClientConfirm = document.querySelector('.delete-client-confirm');
let tBody = document.querySelector('.main__tbody');


//filter
const idFilterButton = document.querySelector('.id__head-container');
const fioFilterButton = document.querySelector('.fio__head-container');
const createFilterButton = document.querySelector('.create__head-container');
const lastchangeFilterButton = document.querySelector('.lastchange__head-container');

const idArrow = document.querySelector('.id-arrow');
const fioArrow = document.querySelector('.fio-arrow');
const createArrow = document.querySelector('.create-arrow');
const lastchangeArrow = document.querySelector('.lastchange-arrow');
idArrow.classList.remove('sort-reverse');
fioArrow.classList.remove('sort-reverse');
createArrow.classList.remove('sort-reverse');
lastchangeArrow.classList.remove('sort-reverse');

//Фильтрация по id по клику на кнопку 
idFilterButton.addEventListener('click', async ()=> {
    if(idSort === 0) {
        idSort = 1;
        idFilterButton.classList.add('selected');
    } else {
        if(idSort === 1) {
            idSort = -1;
            idArrow.classList.add('sort-reverse');
        }
        else {
            idSort = 1;
            idArrow.classList.remove('sort-reverse');
        }
    }
    if(idSort == 1) {
        clientList.sort((first, last) => first.id - last.id);
    }
    if(idSort == -1) {
        clientList.sort((first, last) => last.id - first.id);
    }
    deleteList();
    await returnClientsNames();
    fioArrow.classList.remove('sort-reverse');
    createArrow.classList.remove('sort-reverse');
    lastchangeArrow.classList.remove('sort-reverse');
    fioFilterButton.classList.remove('selected');
    createFilterButton.classList.remove('selected');
    lastchangeFilterButton.classList.remove('selected');
    nameSort = 0;
    createSort = 0;
    changeSort = 0;
    let highlited = document.querySelector('.main__id');
    highlited.classList.add('highlited');
})
let contactsToChangeCount = 0;
//Фильтрация по ФИО по клику на кнопку 
fioFilterButton.addEventListener('click', async ()=> {
    if(nameSort === 0) {
        nameSort = 1;
        fioFilterButton.classList.add('selected');
    } else {
        if(nameSort === 1) {
            nameSort = -1;
            fioArrow.classList.add('sort-reverse');
        }
        else {
            nameSort = 1;
            fioArrow.classList.remove('sort-reverse');
        }
    }
    deleteList();
    if(nameSort == 1) {
        clientList.sort((first, last) => {
            if(first.name + first.surname + first.lastName < last.name + last.surname + last.lastName) return -1;
            if(first.name + first.surname + first.lastName > last.name + last.surname + last.lastName) return 1;
        });
    }
    if(nameSort == -1) {
        clientList.sort((first, last) => {
            if(first.name + first.surname + first.lastName < last.name + last.surname + last.lastName) return 1;
            if(first.name + first.surname + first.lastName > last.name + last.surname + last.lastName) return -1;
        });
    }
    if(headerSearch.value != '') {
        clientList = clientList.filter(function (object) {
            return (`${object.name} ${object.surname} ${object.lastName}`).toLowerCase().trim().includes(headerSearch.value.toLowerCase())
        });
    }
    await returnClientsNames();
    idArrow.classList.remove('sort-reverse');
    createArrow.classList.remove('sort-reverse');
    lastchangeArrow.classList.remove('sort-reverse');
    idFilterButton.classList.remove('selected');
    createFilterButton.classList.remove('selected');
    lastchangeFilterButton.classList.remove('selected');
    idSort = 0;
    createSort = 0;
    changeSort = 0;
})

//Фильтрация по дате создания по клику на кнопку 
createFilterButton.addEventListener('click', async ()=> {
    if(createSort === 0) {
        createSort = 1;
        createFilterButton.classList.add('selected');
    } else {
        if(createSort === 1) {
            createSort = -1;
            createArrow.classList.add('sort-reverse');
        }
        else {
            createSort = 1;
            createArrow.classList.remove('sort-reverse');
        }
    }
    if(createSort == 1) {
        clientList.sort((first, last) => new Date(first.createdAt) - new Date(last.createdAt));
    }
    if(createSort == -1) {
        clientList.sort((first, last) => new Date(last.createdAt) - new Date(first.createdAt));
    }
    deleteList();
    if(headerSearch.value != '') {
        clientList = clientList.filter(function (object) {
            return (`${object.name} ${object.surname} ${object.lastName}`).toLowerCase().trim().includes(headerSearch.value.toLowerCase())
        });
    }
    await returnClientsNames();
    idArrow.classList.remove('sort-reverse');
    fioArrow.classList.remove('sort-reverse');
    lastchangeArrow.classList.remove('sort-reverse');
    idFilterButton.classList.remove('selected');
    fioFilterButton.classList.remove('selected');
    lastchangeFilterButton.classList.remove('selected');
    idSort = 0;
    nameSort = 0;
    changeSort = 0;
})

//Фильтрация по последнему изменению по клику на кнопку 
lastchangeFilterButton.addEventListener('click', async ()=> {
    if(changeSort === 0) {
        changeSort = 1;
        lastchangeFilterButton.classList.add('selected');
    } else {
        if(changeSort === 1) {
            lastchangeArrow.classList.add('sort-reverse');
            changeSort = -1;
        }
        else {
            lastchangeArrow.classList.remove('sort-reverse');
            changeSort = 1;
        }
    }
    if(changeSort == 1) {
        clientList.sort((first, last) => new Date(first.updatedAt) - new Date(last.updatedAt));
    }
    if(changeSort == -1) {
        clientList.sort((first, last) => new Date(last.updatedAt) - new Date(first.updatedAt));
    }
    deleteList();
    if(headerSearch.value != '') {
        clientList = clientList.filter(function (object) {
            return (`${object.name} ${object.surname} ${object.lastName}`).toLowerCase().trim().includes(headerSearch.value.toLowerCase())
        });
    }
    await returnClientsNames();
    idArrow.classList.remove('sort-reverse');
    fioArrow.classList.remove('sort-reverse');
    createArrow.classList.remove('sort-reverse');
    idFilterButton.classList.remove('selected');
    fioFilterButton.classList.remove('selected');
    createFilterButton.classList.remove('selected');
    idSort = 0;
    nameSort = 0;
    createSort = 0;
})
// Обработка события ввода в поиск
let inputTimer = null;
const headerSearch = document.querySelector('.header__input');
headerSearch.addEventListener('input', async () => {
    deleteList();
    if(headerSearch.value != '') {
        clientList =  await listRequest();
        clientList = clientList.filter(function (object) {
            return (`${object.name} ${object.surname} ${object.lastName}`).toLowerCase().trim().includes(headerSearch.value.toLowerCase())
        });
    } else {
        clientList =  await listRequest();
    }
    if(changeSort == 1) {
        clientList.sort((first, last) => new Date(first.updatedAt) - new Date(last.updatedAt));
    }
    if(changeSort == -1) {
        clientList.sort((first, last) => new Date(last.updatedAt) - new Date(first.updatedAt));
    }
    if(createSort == 1) {
        clientList.sort((first, last) => new Date(first.createdAt) - new Date(last.createdAt));
    }
    if(createSort == -1) {
        clientList.sort((first, last) => new Date(last.createdAt) - new Date(first.createdAt));
    }
    if(nameSort == 1) {
        clientList.sort((first, last) => {
            if(first.name + first.surname + first.lastName < last.name + last.surname + last.lastName) return -1;
            if(first.name + first.surname + first.lastName > last.name + last.surname + last.lastName) return 1;
        });
    }
    if(nameSort == -1) {
        clientList.sort((first, last) => {
            if(first.name + first.surname + first.lastName < last.name + last.surname + last.lastName) return 1;
            if(first.name + first.surname + first.lastName > last.name + last.surname + last.lastName) return -1;
        });
    }
    if(idSort == 1) {
        clientList.sort((first, last) => first.id - last.id);
    }
    if(idSort == -1) {
        clientList.sort((first, last) => last.id - first.id);
    }
    if (inputTimer !== null)
        clearTimeout(inputTimer);
    inputTimer = setTimeout( async()=> {
        await returnClientsNames();
    }, 300);
})
let firstListLoad = true;
//загрузка списка клиентов
const returnClientsNames = async () => {
    if(firstListLoad) {
        loading.classList.remove('disabled');
        clientList =  await listRequest();
        loading.classList.add('disabled');
        firstListLoad = false;
    }
    clientList.forEach(item => {
        let tableRow = document.createElement('div');
        let tableCellFirst = document.createElement('div');
        tableRow.classList.add('main__body-tr', 'flex');
        tableCellFirst.classList.add('main__body-td', 'col-1', 'main__id');
        let tableCellSecond = document.createElement('div');
        tableCellSecond.classList.add('main__body-td', 'col-2', 'main__fio');
        let tableCellThird = document.createElement('div');
        tableCellThird.classList.add('main__body-td', 'col-3', 'main__create');
        let tableCellFourth = document.createElement('div');
        tableCellFourth.classList.add('main__body-td', 'col-4', 'main__lastchange');
        let tableCellFifth = document.createElement('div');
        tableCellFifth.classList.add('main__body-td', 'col-5', 'main__contacts', 'flex');
        let tableCellSixth = document.createElement('div');
        tableCellSixth.classList.add('main__body-td', 'col-6', 'main__act', 'flex');
        let changeButton = document.createElement('button');
        changeButton.classList.add('main__act-btn', 'main__change');
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('main__act-btn', 'main__delete');
        let deleteImg = document.createElement('img');
        deleteImg.src = 'img/delete-icon.svg';
        let imgContainer = document.createElement('div');
        imgContainer.classList.add('img-container');
        let changeImg = document.createElement('img');
        let changeSpinImg = document.createElement('img', 'spin');
        changeImg.src = 'img/change-icon.svg';
        changeSpinImg.src = 'img/change-spin.svg';
        changeSpinImg.classList.add('change-spin');
        let changeSpinContainer = document.createElement('div');
        changeSpinContainer.classList.add('change-spin-container', 'disabled');
        let changeSpan = document.createElement('span');
        let deleteSpan = document.createElement('span');
        changeSpan.textContent = 'Изменить';
        deleteSpan.textContent = 'Удалить';
        deleteButton.appendChild(deleteImg);
        deleteButton.appendChild(deleteSpan);
        imgContainer.appendChild(changeImg);
        changeSpinContainer.appendChild(changeSpinImg);
        imgContainer.appendChild(changeSpinContainer);
        changeButton.appendChild(imgContainer);
        changeButton.appendChild(changeSpan);
        tableCellSixth.appendChild(changeButton);
        tableCellSixth.appendChild(deleteButton);
        const deleteClientConfirmContainer = document.querySelector('.delete-confirm-container');
        const deleteCancelBtn = document.querySelector('.delete-confirm__cancel-btn');
        //удаление клиента
        clientModalChangeCancel.addEventListener('click', () => {
            deleteChangeContacts();
            clientModal.classList.add('disabled');
            clientModalChange.classList.add('disabled');
            deleteClientConfirm.classList.remove('disabled');
            toDeleteId = item.id;
            setTimeout(() => {
                deleteClientConfirmContent.classList.add('showmodal');
              }, 10);
        });
        deleteCancelBtn.addEventListener('click', () => {
            deleteClientConfirmContent.classList.remove('showmodal');
            setTimeout(() => {
                clientDeleteConfirm.classList.add('disabled');
                toDeleteId = '';
              }, 700);
        })
        deleteButton.addEventListener('click', () => {
            deleteClientConfirm.classList.remove('disabled');
            toDeleteId = item.id;
            setTimeout(() => {
                deleteClientConfirmContent.classList.add('showmodal');
              }, 10);
        })
        clientDeleteConfirmClose.addEventListener('click', ()=> {
            deleteClientConfirmContent.classList.remove('showmodal');
            setTimeout(() => {
                clientDeleteConfirm.classList.add('disabled');
                toDeleteId = '';
              }, 700);
        })
        deleteClientConfirmContainer.addEventListener('click', ()=> {
            deleteClientConfirmContent.classList.remove('showmodal');
            setTimeout(() => {
                clientDeleteConfirm.classList.add('disabled');
                toDeleteId = '';
              }, 700);
        })
        deleteClientConfirmContent.addEventListener('click', (e)=> {
            e.stopPropagation();
            toDeleteId = '';
        })
        const toChangeSurnameField = document.querySelector('.client-change-modal__surname-input');
        const toChangeNameField = document.querySelector('.client-change-modal__name-input');
        const toChangeLastnameField = document.querySelector('.client-change-modal__lastname-input');
        const toChangeIdField = document.querySelector('.client-modal-change__id');
        const showModalToChange = (modalClassName) => {
            clientModal.classList.remove('disabled');
            modalName = document.querySelector(modalClassName);
            modalName.classList.remove('disabled');
            let nameValue = item.name;
            let surnameValue = item.surname;
            let lastnameValue = item.lastName;
            toChangeSurnameField.value = surnameValue;
            toChangeNameField.value = nameValue;
            toChangeLastnameField.value = lastnameValue;
            toChangeIdField.textContent = `ID: ${item.id}`;
            if(toChangeNameField.value !== '') {
                nameChangePlaceholder.classList.add('filled');
            }
            if(toChangeSurnameField.value !== '') {
                surnameChangePlaceholder.classList.add('filled');
            }
            if(toChangeLastnameField.value !== '') {
                lastnameChangePlaceholder.classList.add('filled');
            }
            item.contacts.forEach(contact => {
                contactsToChangeCount++;
                const newContact = document.createElement('div');
                const customSelect = document.createElement('select');
                const optionTel = document.createElement('option');
                optionTel.textContent = 'Телефон';
                optionTel.classList.add('select__option');
                const optionVk = document.createElement('option');
                optionVk.textContent = 'Vk';
                optionVk.classList.add('select__option');
                const optionEmail = document.createElement('option');
                optionEmail.textContent = 'Email';
                optionEmail.classList.add('select__option');
                const optionFacebook = document.createElement('option');
                optionFacebook.textContent = 'Facebook';
                optionFacebook.classList.add('select__option');
                const optionUncnown = document.createElement('option');
                optionUncnown.textContent = 'Другое';
                optionUncnown.classList.add('select__option');
                const newContactField = document.createElement('input');
                const deleteContact = document.createElement('button');
                deleteContact.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                </svg>`;
                // const deleteSvg = document.createElement('img');
                const deletePopUp = document.createElement('div');
                deletePopUp.classList.add('delete-popup', 'flex');
                let textSpan = document.createElement('span');
                textSpan.classList.add('text');
                textSpan.textContent = 'Удалить контакт';
                let transfromSpan = document.createElement('span');
                transfromSpan.classList.add('transform-popup');
                deletePopUp.appendChild(textSpan);
                deletePopUp.appendChild(transfromSpan);
                deleteContact.appendChild(deletePopUp);
                // deleteSvg.src = "img/deleteContact.svg";
                // deleteContact.appendChild(deleteSvg);
                deleteContact.classList.add('btn', 'delete-contact', 'flex');
                newContactField.classList.add('new-contact-field');
                newContactField.type = 'text';
                customSelect.classList.add('custom-select', 'js-choice-change');
                newContact.classList.add('new-contact-change', 'flex');
                customSelect.appendChild(optionTel);
                customSelect.appendChild(optionVk);
                customSelect.appendChild(optionEmail);
                customSelect.appendChild(optionFacebook);
                customSelect.appendChild(optionUncnown);
                
                toSelectType = contact.type;
                toSelectValue = contact.value;
                newContactField.value = toSelectValue;
                customSelect.value = toSelectType;
                
                newContact.appendChild(customSelect);
                newContact.appendChild(newContactField);
                newContact.appendChild(deleteContact);
                let containerName = document.querySelector('.client-modal__change-fields-container');
                containerName.appendChild(newContact);
            })
            const clientModalChangeBlockLayer = document.querySelector('.client-modal-change__block-layer')
            const clientModalChangeBtn = document.querySelector('.client-modal__change-btn');
                //Изменение клиента при нажатии на соответствующую кнопку в модальном окне
                clientModalChangeBtn.addEventListener("click", async ()=> {
                    clientModalChangeBlockLayer.classList.add('disabled');
                    const nameChangeInput = document.querySelector('.client-change-modal__name-input');
                    const surnameChangeInput = document.querySelector('.client-change-modal__surname-input');
                    const lastnameChangeInput = document.querySelector('.client-change-modal__lastname-input');
                    const newContactList = document.querySelectorAll('.new-contact-change');
                    const changeAlert = document.querySelector('.client-change-modal__alert');
                    let counter = 0;
                    let fieldsArray = document.querySelectorAll('.new-contact-field');
                    let anyWrongField = false;
                    let contactArray = [];
                    newContactList.forEach(singleContact => {
                        let first = singleContact.children[0];
                        let second = first.children[0];
                        let typeValue = second.children[0].value;
                        let contactValue = singleContact.children[1].value;
                        if(contactValue == "") {
                          anyWrongField = true;
                          fieldsArray[counter].classList.add('highlited-field');
                        }
                        let contactPair = {};
                        contactPair['type'] = typeValue;
                        contactPair['value'] = contactValue;
                        contactArray.push(contactPair);
                        counter++;
                    });                    
                    const data = {
                        name: nameChangeInput.value,
                        surname: surnameChangeInput.value,
                        lastName: lastnameChangeInput.value,
                        contacts: contactArray,
                    }
                    fieldsArray.forEach(singleField => {
                      singleField.addEventListener('input', () => {
                        singleField.classList.remove('highlited-field');
                        changeAlert.textContent = '';
                        changeAlert.classList.add('disabled');
                      })
                    })
                    if(nameChangeInput.value == '') {
                      anyWrongField = true;
                      nameChangeInput.classList.add('highlited-field');
                    }
                    if(surnameChangeInput.value == '') {
                      anyWrongField = true;
                      surnameChangeInput.classList.add('highlited-field');
                    }
                    if(anyWrongField === false) {
                      const dataToSend = JSON.stringify(data);
                      await changeClient(item.id, dataToSend);
                      deleteList();
                      clientList = await listRequest();
                      setTimeout(async () => {
                        clientModalChange.classList.remove('showmodal');
                        await returnClientsNames();
                      }, 10);
                      clientModalChangeBlockLayer.classList.remove('disabled');
                      setTimeout(async () => {
                        clientModal.classList.add('disabled');
                        clientModalNew.classList.add('disabled');
                        clientModalChange.classList.add('disabled');
                        deleteNewContacts();
                        surnameChangeInput.value = '';
                        nameChangeInput.value = '';
                        lastnameChangeInput.value = '';
                        nameChangePlaceholder.classList.remove('filled');
                        surnameChangePlaceholder.classList.remove('filled');
                        lastnameChangePlaceholder.classList.remove('filled');
                        clientModalChangeBlockLayer.classList.add('disabled');
                      }, 700);
                      
                    } else {
                      changeAlert.textContent = 'Все поля, кроме поля "Отчество", должны быть обязательно заполнены'; 
                      changeAlert.classList.remove('disabled');
                    }
                }); 
        }

        //Модальное окно изменения
        changeButton.addEventListener('click', async ()=>{
            deleteChangeContacts();
            showModalToChange('.client-modal-change-client');
            const element = document.querySelectorAll('.js-choice-change');
            const deleteContactListToChange = document.querySelectorAll('.delete-contact');
            element.forEach(el => {
            const choicesChange = new Choices(el, {
                searchEnabled: false,
                itemSelectText: '',
                position: 'bottom',
                placeholder: false,
                shouldSort: false
        });
        if(contactsToChangeCount == 10) {
                addContact.classList.add('disabled');
            }
        })
        //Удаление контактов в модальном окне
        deleteContactListToChange.forEach (singleContact => {
            singleContact.addEventListener('click', (e)=> {
                var delBlock = singleContact.parentNode;
                delBlock.parentNode.removeChild(delBlock);
                contactsToChangeCount--;
                if(contactsToChangeCount < 10) {
                    addContact.classList.remove('disabled');
                }
            })
        });
        setTimeout(() => {
            clientModalChange.classList.add('showmodal');
            }, 10);
        })
        //столбец с id
        // let itemId = item.id % 1000000;//в макете указан размер намного меньше действительного
        let itemId = item.id;
        let idLink = document.createElement('a');
        idLink.classList.add('id-link');
        idLink.href = `client.html?id=${item.id}`;
        idLink.textContent = itemId;
        tableCellFirst.appendChild(idLink);
        tableRow.appendChild(tableCellFirst);
        //столбец с ФИО
        tableCellSecond.textContent = item.name + ' ' + item.surname + ' ' + item.lastName;
        tableRow.appendChild(tableCellSecond);
        //столбец с датой создания
        tBody.appendChild(tableRow);
        let createDate = item.createdAt;
        createDate = new Date(createDate);
        let createDay = createDate.getDate();
        let createYear = createDate.getFullYear();
        let createHour = createDate.getHours(); 
        let createMinute = createDate.getMinutes();
        let createDateSpan = document.createElement('span');
        let createMonth = createDate.getMonth() + 1;
        let returnCreateMonth;
        let returnCreateDay;
        let returnCreateHour;
        let returnCreateMinute;
        if(createMonth < 10) {
            returnCreateMonth = '0' + createMonth;
        }
        else {
            returnCreateMonth = createMonth;
        }
        if(createDay < 10) {
            returnCreateDay = '0' + createDay;
        }
        else {
            returnCreateDay = createDay;
        }
        if(createHour < 10) {
            returnCreateHour = '0' + createHour;
        }
        else {
            returnCreateHour = createHour;
        }
        if(createMinute < 10) {
            returnCreateMinute = '0' + createMinute;
        }
        else {
            returnCreateMinute = createMinute;
        }
        
        createDateSpan.classList.add('date');
        let createTimeSpan = document.createElement('span');
        createTimeSpan.classList.add('time');
        createDateSpan.textContent = returnCreateDay + '.' + returnCreateMonth + '.' + createYear;
        createTimeSpan.textContent = ' ' + returnCreateHour + ':' + returnCreateMinute;
        tableCellThird.appendChild(createDateSpan);
        tableCellThird.appendChild(createTimeSpan);
        tableRow.appendChild(tableCellThird);

        //Дата изменения
        let changedDate = item.updatedAt;
        changedDate = new Date(changedDate);
        let changedDay = changedDate.getDate();
        let changedYear = changedDate.getFullYear();
        let changedHour = changedDate.getHours(); 
        let changedMinute = changedDate.getMinutes();
        let changeDateSpan = document.createElement('span');
        let changedMonth = changedDate.getMonth() + 1;
        let returnChangedMonth;
        let returnChangedDay;
        let returnChangedHour;
        let returnChangedMinute;
        if(changedMonth < 10) {
            returnChangedMonth = '0' + changedMonth;
        }
        else {
            returnChangedMonth = changedMonth;
        }
        if(changedDay < 10) {
            returnChangedDay = '0' + changedDay;
        }
        else {
            returnChangedDay = changedDay;
        }
        if(changedHour < 10) {
            returnChangedHour = '0' + changedHour;
        }
        else {
            returnChangedHour = changedHour;
        }
        if(changedMinute < 10) {
            returnChangedMinute = '0' + changedMinute;
        }
        else {
            returnChangedMinute = changedMinute;
        }
        changeDateSpan.classList.add('date');
        let changeTimeSpan = document.createElement('span');
        changeTimeSpan.classList.add('time');
        changeDateSpan.textContent = returnChangedDay + '.' + returnChangedMonth + '.' + createYear;
        changeTimeSpan.textContent = ' ' + returnChangedHour + ':' + returnChangedMinute;
        tableCellFourth.appendChild(changeDateSpan);
        tableCellFourth.appendChild(changeTimeSpan);
        tableRow.appendChild(tableCellFourth);
        let contactsContainer = document.createElement('div');
        contactsContainer.classList.add('main__contacts-container', 'flex');
        // if(item.contacts.length > 5)
        // {

        // }
        item.contacts.forEach(contact => {
            if(contact.type == 'Vk')
            {
                let toolTip = document.createElement('div');
                toolTip.innerHTML = `<svg class="tooltip-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
                </g>
                </svg>`;
                toolTip.classList.add('tooltip');
                let popUp = document.createElement('div');
                popUp.classList.add('popup', 'flex');
                let textSpan = document.createElement('span');
                textSpan.classList.add('text');
                textSpan.textContent = contact.value;
                let transfromSpan = document.createElement('span');
                transfromSpan.classList.add('transform-popup');
                popUp.appendChild(textSpan);
                popUp.appendChild(transfromSpan);
                toolTip.appendChild(popUp);
                contactsContainer.appendChild(toolTip);
            }
            if(contact.type == 'Телефон') {
                let toolTip = document.createElement('div');
                toolTip.innerHTML = `<svg class="tooltip-circle" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                <circle cx="8" cy="8" r="8" fill="#9873FF"/>
                <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
                </g>
                </svg>`;
                toolTip.classList.add('tooltip');
                let popUp = document.createElement('div');
                popUp.classList.add('popup', 'flex');
                let textSpan = document.createElement('span');
                textSpan.classList.add('text');
                textSpan.textContent = contact.value;
                let transfromSpan = document.createElement('span');
                transfromSpan.classList.add('transform-popup');
                popUp.appendChild(textSpan);
                popUp.appendChild(transfromSpan);
                toolTip.appendChild(popUp);
                contactsContainer.appendChild(toolTip);
            }
            if(contact.type == 'Facebook') {
                let toolTip = document.createElement('div');
                toolTip.innerHTML = `<svg class="tooltip-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.7">
                <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
                </g>
                </svg>
                `;
                toolTip.classList.add('tooltip');
                let popUp = document.createElement('div');
                popUp.classList.add('popup', 'flex');
                let textSpan = document.createElement('span');
                textSpan.classList.add('text');
                textSpan.textContent = contact.value;
                let transfromSpan = document.createElement('span');
                transfromSpan.classList.add('transform-popup');
                popUp.appendChild(textSpan);
                popUp.appendChild(transfromSpan);
                toolTip.appendChild(popUp);
                contactsContainer.appendChild(toolTip);
            }
            if(contact.type == 'Email') {
                let toolTip = document.createElement('div');
                toolTip.innerHTML = `<svg class="tooltip-svg" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
                </svg>`;
                toolTip.classList.add('tooltip');
                let popUp = document.createElement('div');
                popUp.classList.add('popup', 'flex');
                let textSpan = document.createElement('span');
                textSpan.classList.add('text');
                textSpan.textContent = contact.value;
                let transfromSpan = document.createElement('span');
                transfromSpan.classList.add('transform-popup');
                popUp.appendChild(textSpan);
                popUp.appendChild(transfromSpan);
                toolTip.appendChild(popUp);
                contactsContainer.appendChild(toolTip);
            }
            if(contact.type != 'Телефон' && contact.type != 'Facebook' && contact.type != 'Email' && contact.type != 'Vk') {
                let toolTip = document.createElement('div');
                toolTip.classList.add('tooltip');
                let svgUncnown = document.createElement('img');
                svgUncnown.src = "img/uncnown-contact.svg";
                svgUncnown.classList.add('contacts-svg');
                toolTip.appendChild(svgUncnown);
                let popUp = document.createElement('div');
                popUp.classList.add('popup', 'flex');
                let textSpan = document.createElement('span');
                textSpan.classList.add('text');
                textSpan.textContent = contact.value;
                let transfromSpan = document.createElement('span');
                transfromSpan.classList.add('transform-popup');
                popUp.appendChild(textSpan);
                popUp.appendChild(transfromSpan);
                toolTip.appendChild(popUp);
                contactsContainer.appendChild(toolTip);
            }
        })
        tableCellFifth.appendChild(contactsContainer);
        tableRow.appendChild(tableCellFifth);
        tableRow.appendChild(tableCellSixth);
    })
}
//добавление контактов в модальном окне изменения клиента
    const changeAddContact = document.querySelector('.change-add-contact');
    changeAddContact.addEventListener('click', ()=>
    {
        contactsToChangeCount++;
        createContacts('.client-modal__change-fields-container');
        const deleteContactListToChange = document.querySelectorAll('.delete-contact');
        const element = document.querySelectorAll('.js-choice-change');
        element.forEach(el => {
        const choicesChange = new Choices(el, {
            searchEnabled: false,
            itemSelectText: '',
            position: 'bottom',
            placeholder: false,
            shouldSort: false
        });
        if(contactsToChangeCount == 10) {
            changeAddContact.classList.add('disabled');
        }
    })
    //Удаление контактов в модальном окне
    deleteContactListToChange.forEach (singleContact => {
        singleContact.addEventListener('click', (e)=> {
            var delBlock = singleContact.parentNode;
            delBlock.parentNode.removeChild(delBlock);
            contactsToChangeCount--;
            if(contactsToChangeCount < 10) {
                changeAddContact.classList.remove('disabled');
              }
        })
    });
});

returnClientsNames();

//Селекторы для модального окна добавления клиентов
const clientModalToClose = document.querySelector('.client-modal-to-close');
const clientModal = document.querySelector('.client-modal');
const clientModalNew = document.querySelector('.client-modal-new-client');
const clientModalChange = document.querySelector('.client-modal-change-client');
const clientModalClose = document.querySelector('.client-modal__close');
const clientModalChangeClose = document.querySelector('.client-modal-change__close');

//Функция показа модального окна
const showModal = (modalClassName) => {
    clientModal.classList.remove('disabled');
    modalName = document.querySelector(modalClassName);
    modalName.classList.remove('disabled');
}

//обработчик события нажатия на кнопку закрытия модального окна создания клиента
clientModalClose.addEventListener('click', ()=> {
    clientModalNew.classList.remove('showmodal');
    setTimeout(() => {
        clientModal.classList.add('disabled');
        clientModalNew.classList.add('disabled');
        clientModalChange.classList.add('disabled');
      }, 700);
});

//обработчик события нажатия на кнопку закрытия модального окна изменения клиента
clientModalChangeClose.addEventListener('click', ()=> {
    clientModalChange.classList.remove('showmodal');
    setTimeout(() => {
        clientModal.classList.add('disabled');
        clientModalNew.classList.add('disabled');
        clientModalChange.classList.add('disabled');
        deleteChangeContacts();
      }, 700);
});

// Закрытие модального окна


//обработчик события нажатия на область вне модального окна
clientModalToClose.addEventListener('click', ()=> {
    clientModalNew.classList.remove('showmodal');
    clientModalChange.classList.remove('showmodal');
    deleteClientConfirmContent.classList.remove('showmodal');
    setTimeout(() => {
        clientModal.classList.add('disabled');
        clientModalNew.classList.add('disabled');
        clientModalChange.classList.add('disabled');
        clientDeleteConfirm.classList.add('disabled');
        deleteChangeContacts();
      }, 700);
    
});

const clientModalChangeCancel = document.querySelector('.client-modal-change__cancel');
const clientModalNewCancel = document.querySelector('.client-modal__cancel');

//обработчик события нажатия на кнопку отмена при создании клиента
clientModalNewCancel.addEventListener('click', () => {
    clientModalNew.classList.remove('showmodal');
    setTimeout(() => {
        clientModalNew.classList.add('disabled');
        clientModal.classList.add('disabled');
        deleteNewContacts();
      }, 700);
    
});
// //запрет на наследование функции родителя при клике на окно
// clientModalNew.addEventListener('click', (e)=> {
//     e.stopPropagation();
// });

//Открытие модального окна создания клиента
const addClientButton = document.querySelector('.main__add-new');
addClientButton.addEventListener('click', ()=>{
    showModal('.client-modal-new-client');
    setTimeout(() => {
        clientModalNew.classList.add('showmodal');
      }, 10);
})

//добавление выпадающего списка в модальном окне добавления контактов
const clientCreateModalFieldsContainer = document.querySelector('.client-modal__fields-container');
const clientChangeModalFieldsContainer = document.querySelector('.client-modal__fields-container');
const createContacts = (containerClass) => {
    const newContact = document.createElement('div');
        const customSelect = document.createElement('select');
        const optionTel = document.createElement('option');
        optionTel.textContent = 'Телефон';
        optionTel.classList.add('select__option');
        const optionVk = document.createElement('option');
        optionVk.textContent = 'Vk';
        optionVk.classList.add('select__option');
        const optionEmail = document.createElement('option');
        optionEmail.textContent = 'Email';
        optionEmail.classList.add('select__option');
        const optionFacebook = document.createElement('option');
        optionFacebook.textContent = 'Facebook';
        optionFacebook.classList.add('select__option');
        const optionUncnown = document.createElement('option');
        optionUncnown.textContent = 'Другое';
        optionUncnown.classList.add('select__option');
        const newContactField = document.createElement('input');
        const deleteContact = document.createElement('button');
        deleteContact.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 0C2.682 0 0 2.682 0 6C0 9.318 2.682 12 6 12C9.318 12 12 9.318 12 6C12 2.682 9.318 0 6 0ZM6 10.8C3.354 10.8 1.2 8.646 1.2 6C1.2 3.354 3.354 1.2 6 1.2C8.646 1.2 10.8 3.354 10.8 6C10.8 8.646 8.646 10.8 6 10.8ZM8.154 3L6 5.154L3.846 3L3 3.846L5.154 6L3 8.154L3.846 9L6 6.846L8.154 9L9 8.154L6.846 6L9 3.846L8.154 3Z" fill="#B0B0B0"/>
                </svg>`;
        const deletePopUp = document.createElement('div');
        deletePopUp.classList.add('delete-popup', 'flex');
        let textSpan = document.createElement('span');
        textSpan.classList.add('text');
        textSpan.textContent = 'Удалить контакт';
        let transfromSpan = document.createElement('span');
        transfromSpan.classList.add('transform-popup');
        deletePopUp.appendChild(textSpan);
        deletePopUp.appendChild(transfromSpan);
        deleteContact.appendChild(deletePopUp);
        deleteContact.classList.add('btn', 'delete-contact', 'flex');
        newContactField.classList.add('new-contact-field');
        newContactField.type = 'text';
        if(containerClass == '.client-modal__change-fields-container') {
            customSelect.classList.add('custom-select', 'js-choice-change');
            newContact.classList.add('new-contact-change', 'flex');
        } else {
            customSelect.classList.add('custom-select', 'js-choice');
            newContact.classList.add('new-contact-create', 'flex');
        }
        customSelect.appendChild(optionTel);
        customSelect.appendChild(optionVk);
        customSelect.appendChild(optionEmail);
        customSelect.appendChild(optionFacebook);
        customSelect.appendChild(optionUncnown);
        newContact.appendChild(customSelect);
        newContact.appendChild(newContactField);
        newContact.appendChild(deleteContact);
        let containerName = document.querySelector(containerClass);
        containerName.appendChild(newContact);
}

//удаление новых контактов при нажатии на кнопку Отмена
const deleteNewContacts = () => {
    const toDeleteContactList = document.querySelectorAll('.new-contact-create');
    toDeleteContactList.forEach(contact => {
        contact.remove();
    })
    contactsCount = 0;
}

const deleteChangeContacts = () => {
    const toDeleteContactList = document.querySelectorAll('.new-contact-change');
    toDeleteContactList.forEach(contact => {
        contact.remove();
    })
}



//добавление полей для ввода контактов в форме создания клиента
let contactsCount = 0;
const addContact = document.querySelector('.add-contact');
addContact.addEventListener('click', ()=>
{
    contactsCount++;
    createContacts('.client-modal__fields-container');
    const deleteContactList = document.querySelectorAll('.delete-contact');
    
    const element = document.querySelectorAll('.js-choice');
    element.forEach(el => {
        const choices = new Choices(el, {
        searchEnabled: false,
        itemSelectText: '',
        position: 'bottom',
        placeholder: false,
        shouldSort: false
  });
  if(contactsCount == 10) {
    addContact.classList.add('disabled');
  }
})


    //Удаление контактов в модальном окне
    deleteContactList.forEach (singleContact => {
        singleContact.addEventListener('click', (e)=> {
            var delBlock = singleContact.parentNode;
            delBlock.parentNode.removeChild(delBlock);
            contactsCount--;
            if(contactsCount < 10) {
                addContact.classList.remove('disabled');
              }
        })
    });
});

const nameInput = document.querySelector('.client-modal__name-input');
const surnameInput = document.querySelector('.client-modal__surname-input');
const lastnameInput = document.querySelector('.client-modal__lastname-input');

const namePlaceholder = document.querySelector('.client-modal__name-placeholder');
const surnamePlaceholder = document.querySelector('.client-modal__surname-placeholder');
const lastnamePlaceholder = document.querySelector('.client-modal__lastname-placeholder');

const nameChangePlaceholder = document.querySelector('.client-change-modal__name-placeholder');
const surnameChangePlaceholder = document.querySelector('.client-change-modal__surname-placeholder');
const lastnameChangePlaceholder = document.querySelector('.client-change-modal__lastname-placeholder');

const nameChangeInput = document.querySelector('.client-change-modal__name-input');
const surnameChangeInput = document.querySelector('.client-change-modal__surname-input');
const lastnameChangeInput = document.querySelector('.client-change-modal__lastname-input');

//кастомные input'ы
//для окна создания клиента
nameInput.addEventListener('input', () => {
    if(nameInput.value !== '') {
        namePlaceholder.classList.add('filled');
        nameInput.classList.remove('highlited-field');
        createAlert.textContent = '';
        createAlert.classList.add('disabled');
    } else {
        namePlaceholder.classList.remove('filled');
    }    
})

surnameInput.addEventListener('input', () => {
    if(surnameInput.value !== '') {
        surnamePlaceholder.classList.add('filled');
        surnameInput.classList.remove('highlited-field');
        createAlert.textContent = '';
        createAlert.classList.add('disabled');
    } else {
        surnamePlaceholder.classList.remove('filled');
    }    
})

lastnameInput.addEventListener('input', () => {
    if(lastnameInput.value !== '') {
        lastnamePlaceholder.classList.add('filled');
    } else {
        lastnamePlaceholder.classList.remove('filled');
    }    
})

//Для окна изменений
nameChangeInput.addEventListener('input', () => {
    if(nameChangeInput.value !== '') {
        nameChangePlaceholder.classList.add('filled');
        nameChangeInput.classList.remove('highlited-field');
    } else {
        nameChangePlaceholder.classList.remove('filled');
    }    
})

surnameChangeInput.addEventListener('input', () => {
    if(surnameChangeInput.value !== '') {
        surnameChangePlaceholder.classList.add('filled');
        surnameChangeInput.classList.remove('highlited-field');
    } else {
        surnameChangePlaceholder.classList.remove('filled');
    }    
})

lastnameChangeInput.addEventListener('input', () => {
    if(lastnameChangeInput.value !== '') {
        lastnameChangePlaceholder.classList.add('filled');
    } else {
        lastnameChangePlaceholder.classList.remove('filled');
    }    
})

//Создание клиента при нажатии на кнопку
const clientModalSave = document.querySelector('.client-modal__save');
const clientModalBlock = document.querySelector('.client-modal__block-layer');
const createAlert = document.querySelector('.client-create-modal__alert');
clientModalSave.addEventListener("click", async ()=> {
    clientModalBlock.classList.add('disabled');
    const newContactList = document.querySelectorAll('.new-contact-create');
    let contactArray = [];
    let counter = 0;
    let fieldsArray = document.querySelectorAll('.new-contact-field');
    let anyWrongField = false;
    newContactList.forEach(singleContact => {
        let first = singleContact.children[0];
        let second = first.children[0];
        let contactValue = singleContact.children[1].value;
        let typeValue = second.children[0].value;
        if(contactValue == "") {
          anyWrongField = true;
          fieldsArray[counter].classList.add('highlited-field');
        }
        
        let contactPair = {};
        contactPair['type'] = typeValue;
        contactPair['value'] = contactValue;
        contactArray.push(contactPair);
        counter++;
    });

    const data = {
        name: nameInput.value,
        surname: surnameInput.value,
        lastName: lastnameInput.value,
        contacts: contactArray,
    }
    fieldsArray.forEach(singleField => {
      singleField.addEventListener('input', () => {
        singleField.classList.remove('highlited-field');
        createAlert.textContent = '';
        createAlert.classList.add('disabled');
      })
    })
    if(nameInput.value == '') {
      anyWrongField = true;
      nameInput.classList.add('highlited-field');
    }
    if(surnameInput.value == '') {
      anyWrongField = true;
      surnameInput.classList.add('highlited-field');
    }
    const dataToSend = JSON.stringify(data);
    if(anyWrongField === false) {
      await addClient(dataToSend);
      clientList = await listRequest();
      deleteList();
      setTimeout(async () => {
        clientModalNew.classList.remove('showmodal');
        await returnClientsNames();
      }, 10);
      clientModalBlock.classList.remove('disabled');
      setTimeout(async () => {
        clientModal.classList.add('disabled');
        clientModalNew.classList.add('disabled');
        clientModalChange.classList.add('disabled');
        clientModalBlock.classList.add('disabled');
        deleteNewContacts();
        surnameInput.value = '';
        nameInput.value = '';
        lastnameInput.value = '';
        namePlaceholder.classList.remove('filled');
        surnamePlaceholder.classList.remove('filled');
        lastnamePlaceholder.classList.remove('filled');
      }, 700);
      createAlert.classList.add('disabled');
      
    } else {
      createAlert.textContent = 'Все поля, кроме поля "Отчество", должны быть обязательно заполнены'; 
      createAlert.classList.remove('disabled');
    }
});
