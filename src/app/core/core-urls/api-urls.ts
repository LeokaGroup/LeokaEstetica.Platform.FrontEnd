/**
 * Список ендпоинтов к API бэку.
 */
export const API_URL = {
    apiUrl: window.location.href.includes("https://leoka-estetica-dev.ru") || window.location.href.includes("http://localhost:4200/")
        // ? "https://leoka-estetica-dev.ru.net"
        ? "http://localhost:9992"
        : window.location.href.includes("https://leoka-estetica-test.ru")
            ? "https://leoka-estetica-test.ru.net"
            : "https://leoka-estetica.ru.net",
    apiUrlProjectManagment: window.location.href.includes("https://leoka-estetica-dev.ru") || window.location.href.includes("http://localhost:4200/")
    // ? "https://leoka-estetica-dev-project-management.ru"
    ? "http://localhost:9995"
    : window.location.href.includes("https://leoka-estetica-test.ru")
        ? "https://leoka-estetica-test-project-management.ru"
        : "https://leoka-estetica-project-management.ru"
};
