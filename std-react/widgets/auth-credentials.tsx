import { Button } from './button'
import { className } from '../react'
import { createElement } from 'react'
import { DotsSpinner as Spinner } from './dots-spinner'
import { Input } from './input'
import { useAuth } from '../auth'
import { useCallback, useMemo, useState } from 'react'

export function useAuthCredentials() {
    const [ credentials, setCredentials ] = useState({identifier: '', secret: ''})
    const { authenticate, pending } = useAuth()
    const [ error, setError ] = useState('')

    const onIdentifierChange = useCallback((identifier: string) => {
        setError('')
        setCredentials(state => ({...state, identifier}))
    }, [])

    const onSecretChange = useCallback((secret: string) => {
        setError('')
        setCredentials(state => ({...state, secret}))
    }, [])

    const validCredentials = useMemo(() =>
        Object
            .values(credentials)
            .map(it => Boolean(it.trim()))
            .every(Boolean)
    , [credentials])

    const onFormSubmitPrevented = useCallback((event: FormEvent) => {
        event.preventDefault()
    }, [])

    const onFormSubmit = useCallback(async () => {
        try {
            await authenticate(credentials)
        }
        catch (error) {
            setError(error)
        }
    }, [credentials])

    return {
        credentials,
        error,
        onFormSubmit,
        onFormSubmitPrevented,
        onIdentifierChange,
        onSecretChange,
        pending,
        validCredentials,
    }
}

export function AuthCredentials(props: AuthCredentialsProps) {
    const { messages, formatError } = props
    const {
        credentials,
        error,
        onFormSubmit,
        onFormSubmitPrevented,
        onIdentifierChange,
        onSecretChange,
        pending,
        validCredentials,
    } = useAuthCredentials()

    return (
        <form
            {...className('a6715629-form', props.className)}
            onSubmit={onFormSubmitPrevented}
        >
            <Input
                className="f8495888-input"
                type="text"
                label={messages?.identifier ?? 'Identifier'}
                value={credentials.identifier}
                autoFocus={true}
                autoComplete="user username email"
                tabIndex={0}
                onChange={onIdentifierChange}
            />
            <Input
                className="f8495888-input"
                type="password"
                label={messages?.secret ?? 'Password'}
                autoComplete="password"
                tabIndex={0}
                value={credentials.secret}
                onChange={onSecretChange}
            />

            <div className="a131712d-error">
                {error && (formatError?.(error) ?? error)}
            </div>

            <Button
                {...className('fcb2658f-button',
                    {busy: pending, 'std-shadow8': validCredentials},
                )}
                type="primary"
                action="submit"
                disabled={pending || ! validCredentials}
                onClick={onFormSubmit}
            >
                <span className="d9466378-message">
                    {messages?.signin ?? 'Signin'}
                </span>

                <Spinner className="a1165c98-spinner" active={pending}/>
            </Button>
        </form>
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface AuthCredentialsProps {
    className?: string
    messages?: {
        identifier?: string
        secret?: string
        signin?: string
    }
    formatError?(error: string): string
}

type FormEvent = React.FormEvent<HTMLFormElement>
