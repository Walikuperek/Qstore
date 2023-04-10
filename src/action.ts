import {Observable, Subject} from 'rxjs';
import {StoreEvent, StoreEventWithPayload} from './interfaces';

export const Action = (): StoreEvent => {
    const action$ = new Subject<void>();
    return {
        listen: (): Observable<void> => action$,
        execute: () => action$.next()
    }
};

export const ActionWith = <Payload>(): StoreEventWithPayload<Payload> => {
    const payload$ = new Subject<Payload>();
    return {
        listen: (): Observable<Payload> => payload$,
        execute: (payload: Payload) => payload$.next(payload)
    }
};
