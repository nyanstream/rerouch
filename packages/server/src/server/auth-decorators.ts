import { fetch } from 'cross-fetch';
import { ObjectId } from 'mongodb';
import type { FastifyRequest, preHandlerHookHandler } from 'fastify';

import CONFIG from '../config.js';

import { getSession } from '../db/sessions.js';

import { getUser } from '../db/users.js';
import { UserRoles } from '../db/users.types.js';

const commonSessionVerifier = async (cookies: FastifyRequest['cookies']) => {
    const authCookie = cookies['authCookie'];

    if (!authCookie) {
        return new Error('Cookie not found');
    }

    const sessionInfo = await getSession({ cookie: authCookie });

    if (!sessionInfo) {
        return new Error('Session with users authCookie not found');
    }

    const currentDate = new Date();
    const authEndDate = new Date(sessionInfo.auth_end_date);

    if (+authEndDate < +currentDate) {
        return new Error('Session is out of date');
    }

    return sessionInfo;
};

export const verifySession: preHandlerHookHandler = async (req, res) => {
    const result = await commonSessionVerifier(req.cookies);

    if (result instanceof Error) {
        res.code(401).send();
        throw result;
    }
};

export const verifyAdminUserSession: preHandlerHookHandler = async (req, res) => {
    const result = await commonSessionVerifier(req.cookies);

    if (result instanceof Error) {
        res.code(401).send();
        throw result;
    }

    const sessionInfo = result;

    const user = await getUser({ _id: new ObjectId(sessionInfo.user_id) });

    if (!user) {
        res.code(401).send();
        throw new Error('User not found (???)');
    }

    if (!user.roles.includes(UserRoles.admin)) {
        res.code(401).send();
        throw new Error('User does not have admin role');
    }
};

export const verifyCaptcha: preHandlerHookHandler = async (req, res) => {
    const requestBody = req.body as { captcha: string };

    if (!CONFIG.API_KEYS.recaptcha) {
        res.code(500).send();
        throw new Error('Recaptcha API key not specified');
    }

    const captchaProviderUrl = new URL('https://www.google.com/recaptcha/api/siteverify');

    captchaProviderUrl.searchParams.append('secret', CONFIG.API_KEYS.recaptcha);
    captchaProviderUrl.searchParams.append('response', requestBody.captcha);

    const recaptchaResponse = await fetch(captchaProviderUrl.toString());
    const recaptchaResponseData = await recaptchaResponse.json();

    if (!recaptchaResponseData.success) {
        res.code(401).send();
        throw new Error('Сaptcha failed');
    }
};
