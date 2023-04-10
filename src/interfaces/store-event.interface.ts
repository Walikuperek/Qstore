import {Observable} from 'rxjs';

export interface StoreEvent {
    execute: () => void;
    listen: () => Observable<void>;
}

export interface StoreEventWithPayload<P> {
    execute: (payload: P) => void;
    listen: () => Observable<P>;
}
