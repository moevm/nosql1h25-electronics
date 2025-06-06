/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PhotoResponse } from '../models/PhotoResponse';
import type { ProductRequest } from '../models/ProductRequest';
import type { ProductRequestListResponse } from '../models/ProductRequestListResponse';
import type { Status } from '../models/Status';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ApiService {
    /**
     * Экспорт резервной копии
     * Позволяет экспортировать данные всех коллекций базы данных в формате JSON.
     * @returns any JSON файл с данными для резервной копии
     * @throws ApiError
     */
    public static apiBackupRetrieve(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/backup/',
        });
    }
    /**
     * Импорт резервной копии
     * Позволяет импортировать данные всех коллекций из JSON файла.
     * @returns any Резервная копия успешно импортирована
     * @throws ApiError
     */
    public static apiBackupCreate({
        formData,
    }: {
        formData?: {
            /**
             * JSON файл резервной копии
             */
            file: Blob;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/backup/',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Загрузить фото
     * Загружает фото в базу данных.
     * @returns PhotoResponse
     * @throws ApiError
     */
    public static apiPhotosCreate({
        formData,
    }: {
        formData?: {
            /**
             * Файл изображения (до 5MB)
             */
            photo: Blob;
        },
    }): CancelablePromise<PhotoResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/photos/',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Получить фото
     * Позволяет получить фото по его ID.
     * @returns any BINARY формат данных
     * @throws ApiError
     */
    public static apiPhotosRetrieve({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/photos/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Получить список заявок
     * Возвращает список заявок с возможностью фильтрации по разным критериям.
     * @returns ProductRequestListResponse
     * @throws ApiError
     */
    public static apiRequestsRetrieve({
        amount,
        author,
        category,
        description,
        from,
        me,
        offset,
        sort,
        status,
        title,
        to,
    }: {
        /**
         * Количество записей для пагинации
         */
        amount?: number,
        /**
         * Фильтрация по автору заявки
         */
        author?: string,
        /**
         * Фильтрация по категории заявки
         */
        category?: string,
        /**
         * Фильтрация по описанию заявки
         */
        description?: string,
        /**
         * Фильтрация по дате начала (формат YYYY-MM-DD)
         */
        from?: string,
        /**
         * Фильтрация по своим заявкам
         */
        me?: boolean,
        /**
         * Смещение для пагинации
         */
        offset?: number,
        /**
         * Сортировка записей (title, description, address, category, fullname, last_update)
         */
        sort?: string,
        /**
         * Фильтрация по статусу заявки
         */
        status?: string,
        /**
         * Фильтрация по названию заявки
         */
        title?: string,
        /**
         * Фильтрация по дате окончания (формат YYYY-MM-DD)
         */
        to?: string,
    }): CancelablePromise<ProductRequestListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/requests/',
            query: {
                'amount': amount,
                'author': author,
                'category': category,
                'description': description,
                'from': from,
                'me': me,
                'offset': offset,
                'sort': sort,
                'status': status,
                'title': title,
                'to': to,
            },
        });
    }
    /**
     * Создать новую заявку
     * Позволяет пользователю создать новую заявку.
     * @returns ProductRequest
     * @throws ApiError
     */
    public static apiRequestsCreate({
        requestBody,
    }: {
        requestBody: ProductRequest,
    }): CancelablePromise<ProductRequest> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/requests/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Получить заявку
     * Позволяет получить заявку по её ID с проверкой прав доступа.
     * @returns ProductRequest
     * @throws ApiError
     */
    public static apiRequestsRetrieve2({
        id,
    }: {
        id: string,
    }): CancelablePromise<ProductRequest> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/requests/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Обновить актуальный статус заявки
     * Позволяет добавить новый статус заявке. Обязательным является указание поля type. Остальные поля необходимо указывать в зависимости от типа заявки.
     * @returns Status
     * @throws ApiError
     */
    public static apiRequestsStatusesCreate({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: Status,
    }): CancelablePromise<Status> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/requests/{id}/statuses',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * OpenApi3 schema for this API. Format can be selected via content negotiation.
     *
     * - YAML: application/vnd.oai.openapi
     * - JSON: application/vnd.oai.openapi+json
     * @returns any
     * @throws ApiError
     */
    public static apiSchemaRetrieve({
        format,
        lang,
    }: {
        format?: 'json' | 'yaml',
        lang?: 'af' | 'ar' | 'ar-dz' | 'ast' | 'az' | 'be' | 'bg' | 'bn' | 'br' | 'bs' | 'ca' | 'cs' | 'cy' | 'da' | 'de' | 'dsb' | 'el' | 'en' | 'en-au' | 'en-gb' | 'eo' | 'es' | 'es-ar' | 'es-co' | 'es-mx' | 'es-ni' | 'es-ve' | 'et' | 'eu' | 'fa' | 'fi' | 'fr' | 'fy' | 'ga' | 'gd' | 'gl' | 'he' | 'hi' | 'hr' | 'hsb' | 'hu' | 'hy' | 'ia' | 'id' | 'ig' | 'io' | 'is' | 'it' | 'ja' | 'ka' | 'kab' | 'kk' | 'km' | 'kn' | 'ko' | 'ky' | 'lb' | 'lt' | 'lv' | 'mk' | 'ml' | 'mn' | 'mr' | 'my' | 'nb' | 'ne' | 'nl' | 'nn' | 'os' | 'pa' | 'pl' | 'pt' | 'pt-br' | 'ro' | 'ru' | 'sk' | 'sl' | 'sq' | 'sr' | 'sr-latn' | 'sv' | 'sw' | 'ta' | 'te' | 'tg' | 'th' | 'tk' | 'tr' | 'tt' | 'udm' | 'uk' | 'ur' | 'uz' | 'vi' | 'zh-hans' | 'zh-hant',
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/schema/',
            query: {
                'format': format,
                'lang': lang,
            },
        });
    }
    /**
     * Получить данные пользователя
     * Позволяет получить данные пользователя по его id.
     * @returns UserResponse
     * @throws ApiError
     */
    public static apiUsersRetrieve({
        id,
    }: {
        id: string,
    }): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
