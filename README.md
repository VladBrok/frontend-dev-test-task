# Тестовое задание на должность Frontend разработчика

## Реализовать SPA приложение для бронирования столов в ресторане.

### Нужно:

- Использовать ReactJs.
- Использовать Redux.
- Получение данных для отображения реализовать при помощи имитации получения данных по API.
- Использовать CSS framework. Например, Bootstrap или MUI.
- Решение расположить на Github.
- Реализовать сборку проекта.

### Не нужно:

- Использовать чужой код.
- Делать как попало.

### Плюсом будет:

- Написать Dockerfile.
- Выложить образ на Docker Hub.

### Что требуется реализовать:

- Регистрация/авторизация пользователя (логин, пароль, номер телефона).
- Выбор даты бронирования в календаре (доступны все даты, все дни недели).
- Выбор времени бронирования стола (ограничить доступное время: с 12:00 до
  22:00).
- Указание кол-ва персон за столом (вводные данные: 7 столов на 2 персоны, 6 столов – 3 персоны, 3 стола - 6 персон).
- Создать ситуацию, когда некоторые столы и время уже заняты и не доступны для бронирования (необходимо сделать позиции изначально недоступными для выбора, а не выдавать ошибку, при сохранениибронирования).
- Все уведомления о крайних точках состояний должны выводитьсяпользователю.
- Личный кабинет для просмотра текущей брони.
- Возможность отмены бронирования (самое позднее за 1 час до времени брони).
