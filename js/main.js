
(() => {
// 'use strict'
  // ############################################################# //
  // # ПРЕОБРАЗОВЫВАЕМ СЕГОДНЯШНЮЮ ДАТУ В УПРОЩЕННЫЙ ВИД
  // ############################################################# //

  function transformDate(input = null) {

    let date = null;

    if (!input) {
      date = new Date();
    } else if (input && input.valueAsDate) {
      date = new Date(input.valueAsDate.getFullYear(), input.valueAsDate.getMonth(), input.valueAsDate.getDate());
    };

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);

    const today = `${year}-${month}-${day}`;

    return {
      day,
      month,
      year,
      today
    };
  };

  // * ########################################################### //
  // * # МАССИВ С ДАННЫМИ СТУДЕНТОВ
  // * ########################################################### //

  // ############################################################# //
  // # СОЗДАЕМ ОБЩИЙ МАССИВ С ДАННЫМИ СТУДЕНТОВ
  // ############################################################# //

  function arrayStudents(defaultValues = []) {
    let totalValues = JSON.parse(localStorage.getItem('studentsValues')) || [];

    if (totalValues.length > 0) {
      return totalValues;
    } else {
      localStorage.setItem('studentsValues', JSON.stringify(defaultValues))
      return totalValues;
    }
  };

  // ############################################################# //
  // # ПРЕОБРАЗОВАНИЕ > ДАТА РОЖДЕНИЯ И ГОД ПОСТУПЛЕНИЯ
  // ############################################################# //

  function transformDatesStudents(student) {
    const dateNow = transformDate(input = null); // ? сегодняшняя дата

    const year = student.dateBirth[0];
    const month = student.dateBirth[1];
    const day = student.dateBirth[2];

    let age = dateNow.year - year;

      if (dateNow.month < month || dateNow.month === month && dateNow.day < day) {
        age--;
      };

    // супплетивизм для возраста студента

    let suppletivism = 'лет';

    if (age === 1) {
      suppletivism = 'год';
    } else if (age > 1 && age < 5) {
      suppletivism = 'года'
    };

    if (age > 20) {
      if (String(age).charAt(1) === '1') {
        suppletivism = 'год';
      } else if (Number(String(age).charAt(1)) > 1 && Number(String(age).charAt(1)) < 5) {
        suppletivism = 'года';
      };
    };

    const date = `${year}.${month}.${day} (${age} ${suppletivism})`;

    student.dateBirth = date;

    // дата поступления

    const SEPTEMBER = 9;
    const JULY = 7;
    const FOUR_YEAR_LEARNING = 4;

    const startLearning = parseInt(student.yearStartLearning);
    const finishLearning = parseInt(student.yearStartLearning) + FOUR_YEAR_LEARNING;
    let course = `${(dateNow.year - startLearning) + 1} курс`;

    if (dateNow.year > finishLearning || dateNow.year == finishLearning && parseInt(dateNow.month) >= SEPTEMBER) {
        course = 'закончил';
    };

    // * по логике, если студент на 1-4 курсе пока не сдаст всю сессию в июне, то он все еще не перешел на новый курс. исключение новые поступившие, так как после поступления они автоматически считаются первокурсниками и ждут начала обучения уже в этом году.

    if (parseInt(dateNow.month) < JULY && (dateNow.year - startLearning) !== 0) {
        course = `${(dateNow.year - startLearning)} курс`;
    }

    student.yearStartLearning = `${startLearning}-${finishLearning} (${course})`

    return {
      student
    };
  };

  // ############################################################# //
  // # ПРЕОБРАЗОВАНИЕ ОБЩЕГО МАССИВА
  // ############################################################# //

  function transformArrayStudents() {
    const totalFinishValues = arrayStudents(defaultValues = []); // ? массив с данными студентов

    // преобразование даты рождения и даты поступления студентов в требуемый вид

    totalFinishValues.forEach((student) => {

      if (student.dateBirth instanceof Array) {
        transformDatesStudents(student);
      };

    });

    return {
      totalFinishValues
    };
  };

  // TODO ######################################################## //
  // TODO # СОЗДАЕМ ЭЛЕМЕНТЫ DOM
  // TODO ######################################################## //

  // ############################################################# //
  // # СОЗДАЕМ ЗАГОЛОВОК СТРАНИЦЫ
  // ############################################################# //

  function createTitle() {
    const title = document.createElement('h1');

    title.classList.add('title');

    title.textContent = 'База данных студентов';

    return {
      title,
    };
  };

  //  ############################################################ //
  //  # СОЗДАЕМ КНОПКИ ДЛЯ ДОБАВЛЕНИЯ НОВОГО СТУДЕНТА И УДАЛЕНИЯ
  //  ############################################################ //

  function createButtons() {
    const buttonsContainer = document.createElement('div');
    const addButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    addButton.innerHTML = `<svg version="1.1" id="add-new-student" width="80" height="80" viewBox="0 0 128 128" preserveAspectRatio="none" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">
    <path id="ico-add__path-1" d="M64 0C28.654 0 0 28.654 0 64 c0 35.345 28.654 64 64 64s64-28.655 64-64C128 28.654 99.346 0 64 0z"/> <path id="ico-add__path-2" d="M94.545 68.364H68.364v26.182h-8.727V68.364H33.455v-8.727 h26.182V33.455h8.727v26.182h26.182V68.364z"/></svg>`;

    deleteButton.innerHTML = `<svg version="1.1" id="delete-student" width="80" height="80" viewBox="0 0 128 128" preserveAspectRatio="none" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">
    <path id="ico-delete__path-1" d="M64 0C28.654 0 0 28.654 0 64 c0 35.345 28.654 64 64 64s64-28.655 64-64C128 28.654 99.346 0 64 0z"/> <path id="ico-delete__path-2" style="fill:#243048;" d="M94.545 71.273H33.455V59.636h61.091V71.273z"/></svg>`;

    buttonsContainer.classList.add('buttons-container');

    addButton.classList.add('button');
    addButton.id = 'add-button';

    deleteButton.classList.add('button');
    deleteButton.id = 'delete-button';

    buttonsContainer.append(addButton, deleteButton);

    return {
      addButton,
      deleteButton,
      buttonsContainer
    };
  };

  // ############################################################# //
  // # СОЗДАЕМ ФОРМУ ДЛЯ ДОБАВЛЕНИЯ НОВОГО СТУДЕНТА
  // ############################################################# //

  function createFormAddNewStudent() {

    const dateNow = transformDate(input = null); // ? сегодняшняя дата

    // создаем элементы

    const formContainer = document.createElement('div');
    const form = document.createElement('form');
    const buttonForm = document.createElement('button');
    const buttonClose = document.createElement('button');

    const formInputs = form.getElementsByTagName('input'); // все iputs в form

    // label

    const [
      nameLabel,
      patronymicLabel,
      surnameLabel,
      dateBirthLabel,
      yearStartLearningLabel,
      facultyLabel
    ] = Array(6).fill().map(() => document.createElement('label'));

    // input

    const [
      nameInput,
      patronymicInput,
      surnameInput,
      dateBirthInput,
      yearStartLearningInput,
      facultyInput
    ] = Array(6).fill().map(() => document.createElement('input'));

    // добавляем классы

    formContainer.classList.add('form-container');
    form.classList.add('form');
    buttonForm.classList.add('button-form');
    buttonClose.classList.add('button-close');
    facultyInput.id = 'faculty';

    // наполнение текстом

    nameLabel.innerText = 'Имя: ';
    patronymicLabel.innerText = 'Отчество: ';
    surnameLabel.innerText = 'Фамилия: ';
    dateBirthLabel.innerText = 'Дата рождения: ';
    yearStartLearningLabel.innerText = 'Год начала обучения: ';
    facultyLabel.innerText = 'Факультет: ';
    buttonForm.innerText = 'Добавить студента в список';
    buttonClose.innerHTML = `<svg version="1.1" id="button-close" width="80" height="80" viewBox="0 0 128 128" preserveAspectRatio="none" baseProfile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">
    <polygon points="128,105.706 105.706,128 64,86.294 22.294,128 0,105.706 41.706,64 0,22.294
		22.294,0 64,41.706 105.706,0 128,22.294 86.294,64"/>`

    // устанавливаем атрибуты

    nameInput.type = 'text';
    patronymicInput.type = 'text';
    surnameInput.type = 'text';
    dateBirthInput.type = 'date';
    dateBirthInput.value = '2000-01-01';
    dateBirthInput.min = '1900-01-01';
    dateBirthInput.max = dateNow.today;
    yearStartLearningInput.type = 'number';
    yearStartLearningInput.value = '2021';
    yearStartLearningInput.min = '2000';
    yearStartLearningInput.max = dateNow.year;
    facultyInput.type = 'text';

    // вкладываем элементы друг в друга

    nameLabel.append(nameInput);
    patronymicLabel.append(patronymicInput);
    surnameLabel.append(surnameInput);
    dateBirthLabel.append(dateBirthInput);
    yearStartLearningLabel.append(yearStartLearningInput);
    facultyLabel.append(facultyInput);
    form.append(nameLabel, patronymicLabel, surnameLabel, dateBirthLabel, yearStartLearningLabel, facultyLabel, buttonForm);
    formContainer.append(form, buttonClose);

    // корректировка в input значений

    const inputs = [... formInputs];

    form.addEventListener('input', (e) => {
      e.preventDefault();
      inputs.forEach((input) => {
        if (input.getAttribute('type') === 'text' && !input.hasAttribute('id', 'faculty')) {
          input.value = input.value.trim().charAt(0).toUpperCase() + input.value.trim().slice(1).toLowerCase();
        }

        if (input.getAttribute('type') === 'date' && input.value) {

          const date = transformDate(input);

          if (date.year > dateNow.year) {
            dateBirthInput.value = dateNow.today;
          } else if (date.month > dateNow.month && date.year === dateNow.year) {
            dateBirthInput.value = dateNow.today;
          } else if (date.day > dateNow.day && date.year === dateNow.year) {
            dateBirthInput.value = dateNow.today;
          } else if (date.year < 1900 && date.year > 999) {
            dateBirthInput.value = '1900-01-01';
          };
        };

        if (input.getAttribute('type') === 'number') {
          if (input.value > dateNow.year) {
            input.value = dateNow.year;
          };
        };
      });
    });

    return {
      nameInput,
      patronymicInput,
      surnameInput,
      dateBirthInput,
      yearStartLearningInput,
      facultyInput,
      buttonForm,
      form,
      formContainer,
      inputs,
      formInputs,
    };
  };

  // ############################################################# //
  // # СОЗДАЕМ ТАБЛИЦУ С СТУДЕНТАМИ
  // ############################################################# //

  function createTableStudents() {

    // создаем элементы

    const tableContainer = document.createElement('div');
    const table = document.createElement('table');
    const tableLine = document.createElement('tr');
    const filtersYearLearning = document.createElement('div')

    // колонки с названиями

    const [
      tableColumnFullName,
      tableColumnDateBirth,
      tableColumnYearStartLearning,
      tableColumnFaculty
    ] = Array(4).fill().map(() => document.createElement('th'));

    // фильтры

    const [
      filterFullName,
      filterDateBirth,
      filterYearStartLearning,
      filterYearEndLearning,
      filterFaculty
    ] = Array(5).fill().map(() => document.createElement('input'));


    // добавляем классы

    tableLine.classList.add('table__line');
    tableContainer.classList.add('table-container');
    table.classList.add('table');
    tableLine.classList.add('table__line');
    tableColumnFullName.classList.add('table__name-column');
    tableColumnDateBirth.classList.add('table__name-column');
    tableColumnYearStartLearning.classList.add('table__name-column');
    tableColumnFaculty.classList.add('table__name-column');
    filtersYearLearning.classList.add('years-learning')

    // наполняем текстом

    tableColumnFullName.innerText = 'Ф.И.О';
    tableColumnDateBirth.innerText = 'Год рождения';
    tableColumnYearStartLearning.innerText = 'Дата обучения';
    tableColumnFaculty.innerText = 'Факультет';

    // устанавливаем атрибуты

    filterFullName.type = 'text';
    filterFullName.placeholder = 'фильтр по фамилии имени и отчестку'
    filterDateBirth.type = 'number';
    filterDateBirth.min = '1900';
    filterDateBirth.max = transformDate(input = null).year;
    filterDateBirth.placeholder = 'фильтр по году рождения'
    filterYearStartLearning.type = 'number';
    filterYearStartLearning.min = '2000';
    filterYearStartLearning.max = transformDate(input = null).year;
    filterYearStartLearning.placeholder = 'начало'
    filterYearEndLearning.type = 'number';
    filterYearEndLearning.min = '2000';
    filterYearEndLearning.max = transformDate(input = null).year + 4;
    filterYearEndLearning.placeholder = 'окончание'
    filterFaculty.type = 'text';
    filterFaculty.placeholder = 'фильтр по факультету'
    tableColumnFullName.id = 'full-name-sort';
    tableColumnDateBirth.id = 'date-birdth-sort';
    tableColumnYearStartLearning.id = 'start-learning-sort';
    tableColumnFaculty.id = 'faculty-sort';

    // вкладываем элементы друг в друга

    filtersYearLearning.append(filterYearStartLearning, filterYearEndLearning)

    tableColumnFullName.append(filterFullName);
    tableColumnDateBirth.append(filterDateBirth);
    tableColumnYearStartLearning.append(filtersYearLearning);
    tableColumnFaculty.append(filterFaculty);
    tableLine.append(tableColumnFullName, tableColumnDateBirth, tableColumnYearStartLearning, tableColumnFaculty);
    table.append(tableLine);
    tableContainer.append(table);

    return {
      tableContainer,
      table,
      tableColumnFullName,
      tableColumnDateBirth,
      tableColumnYearStartLearning,
      tableColumnFaculty,
      tableLine,
      filterFullName,
      filterDateBirth,
      filterYearStartLearning,
      filterYearEndLearning,
      filterFaculty
    }
  };

  // ############################################################# //
  // # СОЗДАЕМ НОВОГО СТУДЕНТА
  // ############################################################# //

  function createNewStudent(name, patronymic, surname, dateBirth, yearStartLearning, faculty, id) {

    // создаем элементы

    const tableLine = document.createElement('tr');

    // создаем ячейки

    const [
      studentFullName,
      studentDateBirth,
      studentYearStartLearning,
      studentFaculty
    ] = Array(4).fill().map(() => document.createElement('td'));

    // добавляем классы

    tableLine.classList.add('table__line', 'student');
    studentFullName.classList.add('table__cell');
    studentDateBirth.classList.add('table__cell');
    studentYearStartLearning.classList.add('table__cell');
    studentFaculty.classList.add('table__cell');

    // наполняем значениями

    studentFullName.innerText = `${surname} ${name} ${patronymic}`;
    studentDateBirth.innerText = `${dateBirth}`;
    studentYearStartLearning.innerText = `${yearStartLearning}`;
    studentFaculty.innerText = `${faculty}`

    // добавляем атрибут с уникальным атрибутом

    tableLine.setAttribute('student-id', id)

    // вкладываем элементы друг в друга

    tableLine.append(studentFullName, studentDateBirth, studentYearStartLearning, studentFaculty);

    return {
      tableLine
    }
  };

  // ! ########################################################### //
  // ! # ПОЛУЧАЕМ РЕЗУЛЬТАТ И ОТПРАВЛЯЕМ В РАЗМЕТКУ
  // ! ########################################################### //

  function getDataBaseStudents() {
    const dateNow = transformDate(input = null); // ? сегодняшняя дата
    const startTotalValues = arrayStudents(defaultValues = []); // ? начальный массив с данными студентов
    const studentsValues = transformArrayStudents().totalFinishValues; // ? обработанный массив с данными студентов
    const titleDataBaseStudents = createTitle(); // ? заголовок страницы
    const buttons = createButtons(); // ? кнопки для добавления и удаления студентов
    const newStudentForm = createFormAddNewStudent(); // ? форма для добавления нового студента
    const tableStudents = createTableStudents(); // ? таблица студентов

    document.body.append(titleDataBaseStudents.title);
    document.body.append(buttons.buttonsContainer);
    document.body.append(newStudentForm.formContainer);
    document.body.append(tableStudents.tableContainer);

    // ? ДОБАВЛЕНИЕ СТУДЕНТОВ ИЗ ХРАНИЛИЩА В БАЗУ ДАННЫХ

    function getStudentsList(studentsValues) {
      studentsValues.forEach(studentValue => {
        const name = studentValue.name;
        const patronymic = studentValue.patronymic;
        const surname = studentValue.surname;
        const dateBirth = studentValue.dateBirth;
        const yearStartLearning = studentValue.yearStartLearning;
        const faculty = studentValue.faculty;
        const id = studentValue.id;

        const student = createNewStudent(name, patronymic, surname, dateBirth, yearStartLearning, faculty, id);

        tableStudents.table.append(student.tableLine);
      });
    };

    getStudentsList(studentsValues);

    // удялем старый список

    function removeStudentList() {
      const oldList = [... document.querySelectorAll('.student')]

      oldList.forEach((item) => {
        item.innerHTML = '';
        // item.remove();
      });
    };

    // ? СОРТИРОВКА И ФИЛЬТРАЦИЯ СТУДЕНТОВ

    let sortValues = studentsValues;

    sortValues.forEach(value => {
      value.fullname = value.surname + value.name + value.patronymic
    });

    const columns = [... document.querySelectorAll('.table__name-column')];

    columns.forEach((column) => {

      // создаем стрелку

      const arrow = document.createElement('div');

      column.append(arrow);
      arrow.innerText = '';
      arrow.classList.add('arrow');

      // фильтрация студентов

      const inputs = [... column.getElementsByTagName('input')]

      inputs.forEach((input) => {
        input.addEventListener('input', (e) => {
          e.preventDefault();

          let result = studentsValues;

          // фильтр по полному имени

          if (tableStudents.filterFullName.value !== 0) {
            removeStudentList()
            result = result.filter(f => (f.surname + f.name + f.patronymic).toLowerCase().includes(tableStudents.filterFullName.value.replace(/\s/g, '').toLowerCase()));
            getStudentsList(result);
          };

          // фильтр по дате рождения

          if (tableStudents.filterDateBirth.value !== 0) {
            removeStudentList()
            result = result.filter(f => f.dateBirth.substr(0, 4).includes(tableStudents.filterDateBirth.value))
            getStudentsList(result);
          };

          // фильтр по дате начала обучения

          if (tableStudents.filterYearStartLearning.value !== 0 && tableStudents.filterYearStartLearning.value.length === 4) {
            removeStudentList()
            result = result.filter(f => f.yearStartLearning.includes(tableStudents.filterYearStartLearning.value));
            getStudentsList(result);
          };

          // фильтр по дате конца обучения

          if (tableStudents.filterYearEndLearning.value !== 0 && tableStudents.filterYearEndLearning.value.length === 4) {
            removeStudentList()
            result = result.filter(f => (f.yearStartLearning.substr(5, 4)).includes(tableStudents.filterYearEndLearning.value));
            getStudentsList(result);
          };

          // фильтр по факультету

          if (tableStudents.filterFaculty.value !== 0) {
            removeStudentList()
            result = result.filter(f => f.faculty.replace(/\s/g, '').toLowerCase().includes(tableStudents.filterFaculty.value.replace(/\s/g, '').toLowerCase()));
            getStudentsList(result);
          };

          if (input.value !== 0) {
            sortValues = result;
          }
        });
      });

      // сортировка студентов

      column.addEventListener('click', (e) => {
        e.preventDefault();

        if (e.target.closest('input')) return;

         // удаляем все стрелки

        const arrows = [... document.querySelectorAll('.arrow')];

        arrows.forEach((arrowTrue) => {
          arrowTrue.innerText = '';
        });

        // добавляем стрелку

        arrow.innerText = '^';
        arrow.classList.toggle('rotate');

        removeStudentList()

        // сортировка по возрастанию

        function sortStudents(key) {
          sortValues.sort((prev, next) => {
            if (prev[key] < next[key]) return -1;
            if (prev[key] === next[key]) return 0;
            if (prev[key] > next[key]) return 1;
          });
        };

        if (column.id === 'full-name-sort') {
          sortStudents('fullname')
        };

        if (column.id === 'date-birdth-sort') {
          sortStudents('dateBirth')
        };

        if (column.id === 'start-learning-sort') {
          sortStudents('yearStartLearning')
        };

        if (column.id === 'faculty-sort') {
          sortStudents('faculty')
        };

        if (!arrow.classList.contains('rotate')) {
          getStudentsList(sortValues);
        } else if (arrow.classList.contains('rotate')) {
          removeStudentList()
          sortValues.reverse();
          getStudentsList(sortValues);
        };

      });
    });

    // ? ПОЯВЛЕНИЕ И ИСЧЕЗНОВЕНИЕ ФОРМЫ ДЛЯ ДОБАВЛЕНИЯ НОВОГО СТУДЕНТА

    const addNewStudent = document.getElementById('add-new-student'); // ? кнопка "+""
    const buttonClose = document.getElementById('button-close'); // ? кнопка в форме "x"

    addNewStudent.addEventListener('click', (e) => {
      e.preventDefault();
      newStudentForm.formContainer.classList.toggle('transform-scale');
    });

    buttonClose.addEventListener('click', (e) => {
      e.preventDefault();
      newStudentForm.formContainer.classList.remove('transform-scale')
    });

    // ? СОБЫТИЕ SUBMIT > ВАЛИДАЦИЯ И ДОБАВЛЕНИЕ НЕВОГО СТУДЕНТА В СПИСОК

    newStudentForm.form.addEventListener('submit', (e) => {
      e.preventDefault();

       // валидация

      const allErrors = newStudentForm.form.querySelectorAll('.validation-error');

      if ([... allErrors]) {
        allErrors.forEach((error) => {
          error.remove();
        });
      };

      newStudentForm.inputs.forEach((input) => {

        const validationError = document.createElement('div');
        validationError.classList.add('validation-error');

        if (input.getAttribute('type') === 'text') {
          if (input.value.trim().length < 2) {
            input.parentElement.append(validationError);
            validationError.innerText = 'Допускается не менее 2 символов';
          } else if (input.value.trim().length > 32 && !input.hasAttribute('id', 'faculty')) {
            input.parentElement.append(validationError);
            validationError.innerText = 'Допускается не более 32 символов';
          } else if (input.value.trim().length > 156 && input.hasAttribute('id', 'faculty')) {
            input.parentElement.append(validationError);
            validationError.innerText = 'Допускается не более 156 символов';
          } else if (! /^[а-яА-ЯёЁ\s]+$/.test(input.value)) {
            input.parentElement.append(validationError);
            validationError.innerText = 'Допускаются только буквы на кирилице';
          };
        };

        if (input.hasAttribute('id', 'faculty')) {
          input.value = input.value.trim();
        };

        if (input.getAttribute('type') === 'date') {
          if (!input.valueAsDate) {
            input.parentElement.append(validationError);
            validationError.innerText = `Вы забыли указать дату`;
          } else if (transformDate(input).year < 1899 || input.value.charAt(0) === '0' && input.value.charAt(1) === '0' ) {
            input.parentElement.append(validationError);
            validationError.innerText = `Допустимый диапазон года от 1900 до ${dateNow.year}`;
          }
        };

        if (input.getAttribute('type') === 'number') {
          if (input.value < 2000 && input.value.length < 4) {
            input.parentElement.append(validationError);
            validationError.innerText = `Допустимый диапазон года от 2000 до ${dateNow.year}`;
          };
        };
      });

      // если проходит валидацию, отправляем данные input

      const validationErrors = newStudentForm.form.getElementsByTagName('div')

      if (!newStudentForm.formInputs.value && validationErrors.length > 0) {
        return;
      } else {

        // ? данные для общего массива

        const studentValue = {
          name: newStudentForm.nameInput.value,
          patronymic: newStudentForm.patronymicInput.value,
          surname: newStudentForm.surnameInput.value,
          dateBirth: [transformDate(newStudentForm.dateBirthInput).year, transformDate(newStudentForm.dateBirthInput).month, transformDate(newStudentForm.dateBirthInput).day],
          yearStartLearning: newStudentForm.yearStartLearningInput.value,
          faculty: newStudentForm.facultyInput.value,
          id: `${newStudentForm.surnameInput.value} ${newStudentForm.nameInput.value} ${newStudentForm.patronymicInput.value} ${Math.random()}`
        };

        startTotalValues.push(studentValue);
        localStorage.setItem('studentsValues', JSON.stringify(startTotalValues));

        // ? обработка данных (требуемый вид у даты рождения и даты поступления) и добавление в список

        const studentNewValue = transformDatesStudents(studentValue).student;

        sortValues.push(studentValue);

        const tableLine = createNewStudent(studentNewValue.name, studentNewValue.patronymic, studentNewValue.surname, studentNewValue.dateBirth, studentNewValue.yearStartLearning, studentNewValue.faculty, studentNewValue.id).tableLine;


        tableStudents.table.append(tableLine);

        // после успешного добавления очищаем поля и извещаем о успехе

        newStudentForm.inputs.forEach((input) => {
            input.form.reset();
        });

        newStudentForm.buttonForm.innerText = 'Данные успешно добавлены!';
        newStudentForm.buttonForm.disabled = true;
        newStudentForm.buttonForm.classList.add('button-form-success');

        let timeout = null;

        clearTimeout(timeout);

        function success() {
          newStudentForm.buttonForm.innerText = 'Добавить студента в список';
          newStudentForm.buttonForm.disabled = false;
          newStudentForm.buttonForm.classList.remove('button-form-success');
        };

        clearTimeout(timeout);
        timeout = setTimeout(success, 2000);
      };
    });

    // ? УДАЛЕНИЕ СТУДЕНТОВ ИЗ СПИСКА

    tableStudents.table.addEventListener('click', (e) => {
      e.preventDefault();

      const studentLine = e.target.closest('.student');

      if (!studentLine) return;

      studentLine.classList.toggle('checked')

    });

    const deleteStudentsButton = document.getElementById('delete-student');

    deleteStudentsButton.addEventListener('click', (e) => {
      e.preventDefault();

      const stutentLine = [... tableStudents.table.querySelectorAll('.student')];

      stutentLine.forEach(student => {
        if (student.classList.contains('checked')) {

          studentsValues.forEach((value, i, startTotalValues) => {
            if (value.id === student.getAttribute('student-id')) {
              startTotalValues.splice(i, 1);
            };
            localStorage.setItem('studentsValues', JSON.stringify(startTotalValues));
          });

          student.remove();
        };
      })
    });

  };

  // ? ########################################################### //
  // ? # ЗАВЕРШАЕМ ВЗАИМОДЕЙСТВИЕ С DOM
  // ? ########################################################### //

  // # ПОЛУЧАЕМ ФУНКЦИЮ С ЗНАЧЕНИЯ ПО УМОЛЧАНИЮ ИЗ HTML

  window.arrayStudents = arrayStudents;

  // # ВЫЗЫВАЕМ ФУНКЦИЮ ПОСЛЕ ЗАГРУЗКИ DOM

  document.addEventListener('DOMContentLoaded', () => {
    getDataBaseStudents();

    // ? ДОРАБОТКА НАД СТИЛЕМ КНОПОК

    const addButtonPathOne = document.getElementById('ico-add__path-1'); // ? addButton path 1
    const addButtonPathTwo = document.getElementById('ico-add__path-2'); // ? addButton path 2
    const deleteButtonPathOne = document.getElementById('ico-delete__path-1'); // ? deleteButton path 1
    const deleteButtonPathTwo = document.getElementById('ico-delete__path-2'); // ? deleteButton path 2
    // addButton
    addButtonPathTwo.addEventListener('mouseover', () => addButtonPathOne.style.fill = "#47ff65");
    addButtonPathTwo.addEventListener('mouseout', () => addButtonPathOne.style.fill = "");
    // deleteButton
    deleteButtonPathTwo.addEventListener('mouseover', () => deleteButtonPathOne.style.fill = "#ff4747");
    deleteButtonPathTwo.addEventListener('mouseout', () => deleteButtonPathOne.style.fill = "");
  });

})();
