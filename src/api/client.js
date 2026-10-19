// מודול אחד לכל הפניות לשרת: מוסיף את ה-token, מפרש את התשובה,
// והופך כל שגיאה ל-ApiError עם הודעה בעברית ועם מזהה הבקשה (CorrelationId).

const API_URL = import.meta.env.VITE_API_URL;

const FALLBACK_MESSAGES = {
  400: 'הנתונים שנשלחו אינם תקינים',
  401: 'יש להתחבר כדי להמשיך',
  403: 'אין לך הרשאה לבצע את הפעולה הזו',
  404: 'הפריט לא נמצא',
  409: 'הפעולה התנגשה עם המצב הנוכחי. יש לרענן ולנסות שוב.',
  500: 'אירעה שגיאה בשרת',
};

export class ApiError extends Error {
  constructor(status, message, correlationId = null) {
    super(message);
    this.status = status;
    this.correlationId = correlationId;
  }
}

let authToken = null;
let onUnauthorized = () => {};

/** נקרא מ-AuthContext בכל התחברות והתנתקות. */
export function setAuthToken(token) {
  authToken = token;
}

/** AuthContext רושם כאן מה לעשות כשה-token כבר לא תקף (401). */
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

export async function apiFetch(path, { method = 'GET', body, query } = {}) {
  const url = new URL(path, API_URL);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const options = { method, headers };
  if (body !== undefined) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError(0, 'אין חיבור לשרת. יש לוודא שהשרת פועל.');
  }

  // 401 עם token = ה-token פג או לא תקף. (401 בלי token הוא סתם התחברות שנכשלה.)
  if (response.status === 401 && authToken) {
    onUnauthorized();
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  return response.status === 204 ? null : response.json();
}

/** ProblemDetails מהשרת → ApiError. סדר העדיפות: detail, שגיאות ולידציה, הודעה כללית לפי סטטוס. */
async function toApiError(response) {
  let problem = null;
  try {
    problem = await response.json();
  } catch {
    // תשובה בלי גוף JSON
  }

  const validationErrors = problem?.errors ? Object.values(problem.errors).flat().join(' ') : null;
  const message =
    problem?.detail ?? validationErrors ?? FALLBACK_MESSAGES[response.status] ?? 'אירעה שגיאה';

  return new ApiError(response.status, message, response.headers.get('X-Correlation-Id'));
}
