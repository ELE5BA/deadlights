import { Router } from 'express';
import { authenticated, loginAdmin, logoutAdmin } from '../services/adminAuthService.js';
import { getAnalytics } from '../services/analyticsService.js';
export const adminRouter = Router();
function tokenFrom(request) { return request.headers.cookie?.split(';').map((item) => item.trim()).find((item) => item.startsWith('deadlights_admin='))?.slice('deadlights_admin='.length); }
function requireAdmin(request, response, next) { if (!authenticated(tokenFrom(request))) return response.status(401).json({ ok: false, error: { code: 'ADMIN_AUTH_REQUIRED', message: 'Admin sign-in is required.' } }); next(); }
adminRouter.post('/login', (request, response) => { const result = loginAdmin(request.body?.passphrase, request.ip); if (result.error) return response.status(result.error === 'RATE_LIMITED' ? 429 : 401).json({ ok: false, error: { code: result.error, message: 'Could not sign in.' } }); response.cookie('deadlights_admin', result.token, { httpOnly: true, sameSite: 'strict', secure: false, maxAge: 1800000 }); response.json({ ok: true, data: { signedIn: true } }); });
adminRouter.post('/logout', (request, response) => { logoutAdmin(tokenFrom(request)); response.clearCookie('deadlights_admin', { httpOnly: true, sameSite: 'strict' }); response.json({ ok: true, data: { signedOut: true } }); });
adminRouter.get('/analytics', requireAdmin, (request, response, next) => { try { const data = getAnalytics(request.query); if (data.error) return response.status(400).json({ ok: false, error: { code: data.error, message: 'Choose a valid date range.' } }); response.json({ ok: true, data }); } catch (error) { next(error); } });
