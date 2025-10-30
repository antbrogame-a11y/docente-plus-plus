// tests/mocks/firebaseMock.js
import { jest } from '@jest/globals';

// Simula le funzioni di Firestore utilizzate nell'applicazione.
// Ognuna è una funzione mock di Jest.
export const getFirestore = jest.fn(() => ({
  // Simula l'oggetto del database restituito da getFirestore
}));

export const collection = jest.fn((db, path) => ({
  // Simula l'oggetto della collezione
  path,
}));

export const addDoc = jest.fn(async (collectionRef, data) => {
  // Simula l'aggiunta di un documento, restituendo un riferimento fittizio
  return Promise.resolve({ id: `mock_${Date.now()}` });
});

export const getDocs = jest.fn(async (collectionRef) => {
    // Simula la restituzione di una query snapshot vuota
    return Promise.resolve({ docs: [] });
});

export const doc = jest.fn();
export const getDoc = jest.fn();
export const updateDoc = jest.fn(() => Promise.resolve());
export const deleteDoc = jest.fn(() => Promise.resolve());
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const serverTimestamp = jest.fn();
