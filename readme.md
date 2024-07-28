Файлы css, js, шрифты, изображения расположены в папке js-front, основной js-код расположен в файле index.js, файл client.html содержит страницу с карточкой клиента.

Для запуска необходимо для начала перейти в папку crm-backend, после чего запустить сервер командой node index, после чего можно будет запустить клиент, открыв файл index.html

Суть проекта в демонстрации навыков, полученных в ходе обучение в модулях JS и Веб-верстка

Приложение является мини-CRM системой, где можно добавлять, удалять, изменять информацию о клиентах по запросам к серверу, фильтровать таблицу по одному или нескольким параметрам, вести поиск совместно или отдельно от фильтра. Также в приложении реализованы открытие и закрытие модальных окон, адаптивная верстка под экран компьютера, планшета и мобильного телефона.

Весь проект реализован с помощью HTML, CSS и чистого JavaScript без применения каких-либо сторонних библиотек (требование проекта).

Список дополнительных изменений:
1. Анимация открытия/закрытия модальных окон - реализовано через добавление и удаление у модального окна класса "showmodal", с применением задержки в 700мс, что равно времени анимации появления и закрытия модального окна. Пример:
clientDeleteConfirmClose.addEventListener('click', ()=> {
            deleteClientConfirmContent.classList.remove('showmodal');
            setTimeout(() => {
                clientDeleteConfirm.classList.add('disabled');
                toDeleteId = '';
              }, 700);
        })
2. Ссылки на карточки клиентов. Реализовано через передачу параметра id клиента в ссылке, по кторому на отдельной странице карточки клиента (client.html) делается запрос к серверу. Переход на страницу карточки клиента происходит через клик по id клиента в соответсвтующем столбце таблицы.

3. Валидация формы перед отправкой на сервер. Реализовано через проверку на пустоту отдельно полей имя и фамилия при нажатии на кнопку "Сохранить", а также каждого существующего поля с контактными данными, при этом учитывается индекс каждого поля для реализации подсветки красным цветом каждого поля.

4. Индикация загрузки. Анимация загрузки таблицы реализована через добавление слоя с загрузкой поверх таблицы до момента загрузки данных клиентов, запускается повторно при последующих запросах к списку клиентов. Для наглядности была добавлена небольшая задержка для демонстрации работы, так как из-за слишком высокой скорости обработки запроса загрузку сложно заметить.
Индикация загрузки при открытии формы изменения клиента не нужна, так как данные о клиенте загружаются заранее через общий список клиентов, а при нажатии на кнопку делается обращение к конктретному клиенту(item) (с 416-й строки в index.js):
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
Индикация загрузки при отправке данных из формы создания или редактирования клиентов реализована через использование полупрозрачного слоя поверх модального окна с классом client-modal__block-layer.