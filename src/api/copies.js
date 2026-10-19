import { apiFetch } from './client';

export const getCopies = (bookId) => apiFetch(`/api/books/${bookId}/copies`);

export const addCopy = (bookId, barcode) =>
  apiFetch(`/api/books/${bookId}/copies`, { method: 'POST', body: { barcode } });

/** ספרנית ומנהלת: Lost (אבד/נהרס) או Available (נמצא). 409 אם העותק מושאל. */
export const changeCopyStatus = (copyId, status) =>
  apiFetch(`/api/copies/${copyId}`, { method: 'PATCH', body: { status } });
