/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CustomTokenObtainPair } from '../models/CustomTokenObtainPair';
import type { Register } from '../models/Register';
import type { TokenResponse } from '../models/TokenResponse';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * User login
     * @returns TokenResponse Login successful. Returns token.
     * @throws ApiError
     */
    public static authLoginCreate({
        requestBody,
    }: {
        requestBody: CustomTokenObtainPair,
    }): CancelablePromise<TokenResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                403: `Invalid credentials`,
            },
        });
    }
    /**
     * @returns void
     * @throws ApiError
     */
    public static authLogoutCreate(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout/',
            errors: {
                401: `Authentication required`,
                403: `You do not have permission to perform this action`,
            },
        });
    }
    /**
     * @returns UserResponse Current user info
     * @throws ApiError
     */
    public static authMeRetrieve(): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me/',
            errors: {
                401: `Authentication required`,
                403: `You do not have permission to perform this action`,
            },
        });
    }
    /**
     * Register a new user
     * @returns void
     * @throws ApiError
     */
    public static authRegisterCreate({
        requestBody,
    }: {
        requestBody: Register,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Login already exists`,
                403: `Validation error`,
            },
        });
    }
}
