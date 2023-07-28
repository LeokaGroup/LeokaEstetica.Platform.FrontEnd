/**
 * Список ендпоинтов к API бэку.
 */
export const API_URL = {
    apiUrl: window.location.href.includes("https://leoka-estetica-dev.ru") || window.location.href.includes("http://localhost:4200/")
        ? "https://leoka-estetica-dev.online"
        // ? "http://localhost:9992"
        : window.location.href.includes("https://leoka-estetica-dev.test")
            ? "https://leoka-estetica-test.online"
            : "https://leoka-estetica.online"
};
