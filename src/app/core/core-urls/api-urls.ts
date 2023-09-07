/**
 * Список ендпоинтов к API бэку.
 */
export const API_URL = {
    apiUrl: window.location.href.includes("https://leoka-estetica-dev.ru") || window.location.href.includes("http://localhost:4200/")
        ? "leoka-estetica-dev.ru.net"
        // ? "http://localhost:9992"
        : window.location.href.includes("https://leoka-estetica-test.ru")
            ? "leoka-estetica-test.ru.net"
            : "leoka-estetica.ru.net"
};
