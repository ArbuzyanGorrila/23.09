# Базовые принципы именования endpoint

- Использовать существительные во множественном числе.

**Правильно:**
```http
/users
/products
```

**Неправильно:**
```http
/get-user
/create-product
```

- Использовать вложенность (иерархию) для связи ресурсов.

**Пример:**
```http
/users
/users/{userId}/orders
```

- Использовать kebab-case для сложных названий.

**Пример:**
```http
/items
/items/{itemId}/upload
```

- Избегать лишних слов (не добавлять глаголы, если это не требуется).

**Пример:**

Правильно:
```http
/products
```

А не:
```http
/get-products
```

# Как выбрать HTTP-метод

- **POST →** создаёт новый ресурс.

```http
POST /products
POST /users/{userId}/upload
```

- **Получить → GET** — возвращает данные, не изменяя ресурсы.

```http
GET /users
GET /users/{userId}/profile
GET /users?id=7
```

- **Обновить (изменить) → PUT или PATCH** — обновляет существующий ресурс.

`PUT` — полная замена.

`PATCH` — частичное изменение.

```http
PUT /users/{userId}/avatar
PATCH /users/{userId}/settings
```

- **Удалить → DELETE** — удаляет ресурс по его ID.

```http
DELETE /users?id=2
DELETE /users/{userId}
```

# Когда использовать Query-параметры

Query-параметры — это параметры после вопросительного знака (`?`) в URL.

- Необходимо фильтровать, сортировать или искать данные.
- Пагинация (`page` и `limit`).
- Передача данных, которые не являются частью идентификатора ресурса.

```http
Фильтрация
GET /products?status=ordered

Сортировка по ключу
GET /products?sortKey=1

Сортировка по свойству
GET /products?name=ASC

Сортировка по нескольким полям
GET /products?order=name:ASC,price:DESC

Поиск
GET /search?q=Android

Пагинация
GET /products?page=1&limit=20
```

# Когда использовать PATH-параметры

PATH-параметры — это части URL, которые указывают на конкретный ресурс или его вложенную часть.

- Когда нужно указать обязательный идентификатор ресурса.
- При обращении к конкретному экземпляру ресурса.
- При реализации иерархического URL-запроса.

```http
PATCH /users/{userId}/settings
GET /users/{userId}/orders?status=Completed
```