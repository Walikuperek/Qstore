import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map} from 'rxjs/operators';

export abstract class Store<T> {
    private state$: BehaviorSubject<T>;

    protected constructor(initialState: T) {
        this.state$ = new BehaviorSubject(initialState);
    }

    select<K>(mapFn: (state: T) => K): Observable<K> {
        return this.state$.asObservable().pipe(
            map((state: T) => mapFn(state)),
            distinctUntilChanged()
        );
    }

    set(state: Partial<T>): void {
        this.state$.next({...this.values, ...state});
    }

    get values(): T {
        return this.state$.getValue();
    }
}
