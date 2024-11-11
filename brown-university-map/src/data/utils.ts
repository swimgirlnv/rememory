// utils.ts

let currentId = 0;

export function generateId(): number {
    return ++currentId;
}