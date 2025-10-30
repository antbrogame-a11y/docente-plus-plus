export default {
    // Imposta l'ambiente di test per simulare un browser
    testEnvironment: 'jsdom',

    // Il transform vuoto è necessario per la compatibilità con i moduli ES
    transform: {},

    // Mappa le richieste di moduli a file specifici (mock)
    moduleNameMapper: {
        // Simula gli import di URL remoti (es. CDN di Firebase)
        '^https?://.*': '<rootDir>/tests/mocks/fileMock.js',
        // Simula gli import di file di stile (CSS, SCSS, etc.)
        '\\.(css|less|scss|sass)$' : '<rootDir>/tests/__mocks__/styleMock.js'
    },

    // Specifica da quali file raccogliere le informazioni di copertura dei test
    collectCoverageFrom: [
        'js/**/*.js',
        'src/**/*.js',
        '!**/node_modules/**',
        '!**/*.test.js'
    ]
};
