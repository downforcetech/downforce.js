import {Enum} from '@downforce/std/enum'
import type {ValueOf} from '@downforce/std/type'
import type {AuthAuthenticateOptions, AuthCredentials, AuthInvalidateOptions, AuthValidateOptions} from '@downforce/web/auth'
import {authenticate, invalidateAuthentication, validateAuthentication} from '@downforce/web/auth'
import {throwInvalidResponse} from '@downforce/web/error'
import {startTransition, useCallback, useMemo, useState} from 'react'
import {useBusyLock} from './busy.js'

export const AuthTokenStateEnum: {
    Missing: 'Missing'
    Validating: 'Validating'
    Valid: 'Valid'
    Invalid: 'Invalid'
} = Enum({
    Missing: 'Missing',
    Validating: 'Validating',
    Valid: 'Valid',
    Invalid: 'Invalid',
})

export function useAuthentication(args: UseAuthenticationOptions): UseAuthenticationContract {
    const {
        authenticate: authenticateOptions,
        validate: validateOptions,
        invalidate: invalidateOptions,
    } = args
    const [tokenState, setTokenState] = useState<undefined | AuthTokenStateEnumType>(undefined)
    const {busy, busyLock, busyRelease} = useBusyLock()

    const validateToken = useCallback(async (token: undefined | string): Promise<undefined> => {
        if (! token) {
            setTokenState(AuthTokenStateEnum.Missing)
            return
        }

        setTokenState(AuthTokenStateEnum.Validating)
        busyLock()

        try {
            const tokenIsValid = await validateAuthentication(token, validateOptions)

            startTransition(() => {
                setTokenState(tokenIsValid ? AuthTokenStateEnum.Valid : AuthTokenStateEnum.Invalid)
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
                setTokenState(AuthTokenStateEnum.Valid)
            })

            return token
        }
        finally {
            startTransition(() => {
                busyRelease()
            })
        }
    }, [authenticateOptions])

    const destroySession = useCallback(async (token: string): Promise<undefined> => {
        setTokenState(AuthTokenStateEnum.Missing)

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
        const isAuthenticated = tokenState === AuthTokenStateEnum.Valid

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

export function AuthBarrier(props: AuthBarrierProps): React.ReactNode {
    const {children, fallback, progress, tokenState} = props

    switch (tokenState) {
        // Fast path, from the most common to least common.
        case AuthTokenStateEnum.Valid:
            return children // Token has been verified and is valid. We can safely continue.
        case AuthTokenStateEnum.Missing:
        case AuthTokenStateEnum.Invalid:
            return fallback // Token is missing or invalid.
        case AuthTokenStateEnum.Validating:
            return progress // We are waiting the response from the server.
        case undefined:
            return
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UseAuthenticationOptions {
    authenticate: AuthAuthenticateOptions
    invalidate: AuthInvalidateOptions
    validate: AuthValidateOptions
}

export interface UseAuthenticationContract {
    tokenState: undefined | AuthTokenStateEnumType
    isAuthenticated: boolean
    pending: boolean
    validateToken(token: undefined | string): Promise<undefined>
    authenticateCredentials(credentials: AuthCredentials): Promise<string>
    destroySession(token: string): Promise<undefined>
}

export type AuthTokenStateEnumType = ValueOf<typeof AuthTokenStateEnum>

export interface AuthBarrierProps {
    tokenState: undefined | AuthTokenStateEnumType
    children: React.ReactNode
    progress: React.ReactNode
    fallback: React.ReactNode
}
