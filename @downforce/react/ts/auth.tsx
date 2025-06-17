import type {ValueOf} from '@downforce/std/type'
import type {AuthAuthenticateOptions, AuthCredentials, AuthInvalidateOptions, AuthValidateOptions} from '@downforce/web/auth'
import {authenticate, invalidateAuthentication, validateAuthentication} from '@downforce/web/auth'
import {throwInvalidResponse} from '@downforce/web/error'
import {startTransition, useCallback, useMemo, useState} from 'react'
import {useBusyLock} from './busy.js'

export const AuthTokenState = {
    Missing: 'Missing' as const,
    Validating: 'Validating' as const,
    Valid: 'Valid' as const,
    Invalid: 'Invalid' as const,
}

export function useAuthentication(args: AuthenticationOptions): AuthenticationManager {
    const {
        authenticate: authenticateOptions,
        validate: validateOptions,
        invalidate: invalidateOptions,
    } = args
    const [tokenState, setTokenState] = useState<undefined | AuthTokenStateEnum>(undefined)
    const {busy, busyLock, busyRelease} = useBusyLock()

    const validateToken = useCallback(async (token: undefined | string) => {
        if (! token) {
            setTokenState(AuthTokenState.Missing)
            return
        }


        setTokenState(AuthTokenState.Validating)
        busyLock()

        try {
            const tokenIsValid = await validateAuthentication(token, validateOptions)

            startTransition(() => {
                setTokenState(tokenIsValid ? AuthTokenState.Valid : AuthTokenState.Invalid)
            })
        }
        finally {
            startTransition(() => {
                busyRelease()
            })
        }
    }, [validateOptions])

    const authenticateCredentials = useCallback(async (credentials: AuthCredentials) => {
        busyLock()
        try {
            const token = await authenticate(credentials, authenticateOptions)

            startTransition(() => {
                setTokenState(AuthTokenState.Valid)
            })

            return token
        }
        finally {
            startTransition(() => {
                busyRelease()
            })
        }
    }, [authenticateOptions])

    const destroySession = useCallback(async (token: string) => {
        setTokenState(AuthTokenState.Missing)

        if (! token) {
            return
        }

        busyLock()
        try {
            const ok = await invalidateAuthentication(token, invalidateOptions)

            if (! ok) {
                throwInvalidResponse('useAuthentication().destroySession()')
            }
        }
        finally {
            startTransition(() => {
                busyRelease()
            })
        }
    }, [invalidateOptions])

    const auth = useMemo(() => {
        const isAuthenticated = tokenState === AuthTokenState.Valid

        return {
            tokenState,
            isAuthenticated,
            pending: busy > 0,
            validateToken,
            authenticateCredentials,
            destroySession,
        }
    }, [
        tokenState,
        busy,
        validateToken,
        authenticateCredentials,
        destroySession,
    ])

    return auth
}

// Types ///////////////////////////////////////////////////////////////////////

export interface AuthenticationOptions {
    authenticate: AuthAuthenticateOptions
    invalidate: AuthInvalidateOptions
    validate: AuthValidateOptions
}

export interface AuthenticationManager {
    tokenState: undefined | AuthTokenStateEnum
    isAuthenticated: boolean
    pending: boolean
    validateToken: (token: undefined | string) => void
    authenticateCredentials: (credentials: AuthCredentials) => Promise<string>
    destroySession: (token: string) => Promise<void>
}

export type AuthTokenStateEnum = ValueOf<typeof AuthTokenState> & string
