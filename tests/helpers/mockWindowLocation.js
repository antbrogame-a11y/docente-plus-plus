// Robust helper per mockare window.location nei test.
// Ritorna una funzione `restore()` per ripristinare lo stato originale.
export default function mockWindowLocation(overrides = {}) {
  const original = window.location;
  const descriptor = Object.getOwnPropertyDescriptor(window, 'location');

  // Se la property non è configurabile usiamo spy su metodi (fallback)
  if (descriptor && descriptor.configurable === false) {
    const spies = [];
    Object.keys(overrides).forEach((key) => {
      if (typeof original[key] === 'function') {
        // Se overrides[key] è una funzione, la usiamo come implementazione,
        // altrimenti mockImplementation con una funzione vuota.
        const impl = typeof overrides[key] === 'function' ? overrides[key] : () => {};
        const spy = jest.spyOn(original, key).mockImplementation(impl);
        spies.push(spy);
      } else {
        // Non sovrascriviamo proprietà non-funzione in questo fallback
      }
    });
    return () => spies.forEach((s) => s.mockRestore());
  }

  // Caso normale: ridefinizione sicura di window.location
  const mock = { ...original, ...overrides };
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: mock,
  });

  return function restore() {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: original,
    });
  };
}
