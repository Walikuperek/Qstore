# Qstore
![QstoreLogo](https://quak.com.pl/assets/logo/qstore_no_bg.png)
![LicenseBadge](https://img.shields.io/github/license/walikuperek/qtheme)
![TestsBadge](https://img.shields.io/badge/Tests-5%2F5%20%E2%9C%85-success)

* [GitHub repository](https://github.com/Walikuperek/Qstore)
* [NPM package](https://www.npmjs.com/package/@quak.lib/qstore)

~3kb.js, production-ready, reactive state management library for Angular/React/any framework.

## Install
```
npm install @quak.lib/qstore
```

## Qstore - Table of Contents

* [Requirements](#requirements)
* [Installation](#installation)
* [Overview](#overview)
    - [Preferably use Actions](#preferably-use-actions)
* [Getting started](#getting-started)
    - [How to use it?](#how-to-use-it)
    - [class Store](#class-store)
      - [Initialize default data](#initialize-default-data)
      - [Read data](#read-data)
      - [Write data](#write-data)
      - [Pipe data](#pipe-data)
    - [function Action](#function-action)
      - [Initialize action](#initialize-action)
      - [Listen to action executions](#listen-to-action-executions)
      - [Execute action](#execute-action)
* [API](#api)
    - [Store\<StoreState\>](#storestorestate)
    - [Action](#action)
    - [ActionWith\<Payload\>](#actionwithpayload)
* [Examples](#examples)
    - [Angular](#angular)
       - [Basic usage](#basic-usage)
       - [Commands and queries](#commands-and-queries)
       - [Strategy | How to append & group](#strategy--how-to-append--group)
       - [Facade | Multi stores for a single feature](#facade--multi-stores-for-a-single-feature)
* [Generic stores](#generic-stores)
    - [SearchStore\<DataType, Filter\>](#searchstoredatatype-filter)
    - [SearchStore\<DataType, Filter\> usage example in Angular](#searchstoredatatype-filter-usage-example-in-angular)
* [License](#license)

## Requirements
![RxJSlogo](https://rxjs.dev/assets/images/logos/logo.png)
* rxjs@^6.0.0

## Installation
```bash
npm install @quak.lib/qstore
```

## Overview
Store represents your data, use it wisely. Preferably use store per feature or split it and add facade.
```typescript
import {Store} from '@quak.lib/qstore';

// Ensure that this is global, so that you can use it in any place in your application.
// In Angular use SimplestStore as a service with @Injectable({providedIn: 'root'}).
class ProductsStore extends Store<{ selectedProductsIds: string[] }> {
    selectedProductsIds$ = this.select(state => state.selectedProductsIds);

    constructor() {
        super({selectedProductsIds: []});
    }
    
    appendSelectedProductId(productId: string): void {
        this.set({
            selectedProductsIds: [...this.values.selectedProductsIds, productId]
        });
    }

    setSelectedProductsIds(selectedProductsIds: string[]): void {
        this.set({selectedProductsIds});
    }
}

// Or with actions
class SelectedProductStore extends Store<{selectedProduct: Product}> {
    selectedProductsIds$ = this.select(state => state.selectedProductsIds);
    actions = {
        setSelectedProduct: ActionWith<Product>(),
    };
    
    constructor() {
        super({selectedProduct: null});
        
        this.actions.setSelectedProduct.listen()
            .subscribe(selectedProduct => {
                this.set({selectedProduct});
            });
    }
}
```

### Preferably use Actions

To execute some logic and listen to executions outside store, use action - *and achieve so-called effects*.

```typescript
import {Store, Action, ActionWith} from '@quak.lib/qstore';

// Usage with actions
class Component {
    innerCounter = 0;
    
    constructor(public store: ProductsStore) {
        // Actions are usefull when you need to listen to some external events and react to them.
        this.store.actions.resetSelectedProductsIds.listen()
            .subscribe(() => this.innerCounter = 0);
    }

    appendProduct(productId: string) {
        this.store.actions.appendSelectedProductId.execute(productId);
        this.innerCounter++;
    }
}

class ProductsStore extends Store<{ selectedProductsIds: string[] }> {
    selectedProductsIds$ = this.select(state => state.selectedProductsIds);

    actions = {
        resetSelectedProductsIds: new Action(),
        appendSelectedProductId: new ActionWith<string>(),
        setSelectedProductsIds: new ActionWith<string[]>() // use objects if you need more complex data
    };

    constructor() {
        super({selectedProductsIds: []});
        this.actions.appendSelectedProductId.listen().subscribe(this.appendSelectedProductId);
        this.actions.resetSelectedProductsIds.listen().subscribe(() => this.setSelectedProductsIds([]));
        this.actions.setSelectedProductsIds.listen().subscribe(this.setSelectedProductsIds);
    }

    appendSelectedProductId(productId: string): void {
        this.set({
            selectedProductsIds: [...this.values.selectedProductsIds, productId]
        });
    }

    setSelectedProductsIds(selectedProductsIds: string[]): void {
        this.set({selectedProductsIds});
    }
}
```

## Getting started
**Qstore** is a reactive state management library for Angular/React/any framework. It is easy to use, production-ready and very small. It is a good choice for small and enterprise applications, because it is very flexible and very scalable.

### How to use it?
Install the package:
```bash
npm install @quak.lib/qstore
```

Import:
```typescript
import {Store, Action, ActionWith} from '@quak.lib/qstore';
```

Create interface for your store state:
```typescript
interface StoreState {
    myData: string;
}
```

Create store:
```typescript
class MyStore extends Store<StoreState> {
    constructor() {
        super({myData: 'Hello world!'});
    }
}
```

Create action & listen & update store:
```typescript
class MyStore extends Store<IStoreState> {
    myAction = new ActionWith<string>();

    constructor() {
        super({myData: 'Hello world!'});
        this.myAction.listen().subscribe(this.myActionHandler);
    }

    myActionHandler(data: string) {
        this.set({myData: data});
    }
}
```

Read data from store:
```typescript
class MyStore extends Store<IStoreState> {
    myData$ = this.select(state => state.myData);

    constructor() {
        super({myData: 'Hello world!'});
    }
}

class Component {
    constructor(public store: MyStore) {
        this.store.myData$.subscribe(data => console.log(data));
        const currMyData = this.store.values.myData;
    }
}
```
Usage in HTML in Angular
```html
<div *ngIf="store.myData$ | async as myData">
    {{myData}}
</div>
```

### class Store
Store is a base class for store wrappers for your data. It is a reactive data source, which means that you can subscribe to changes in your data.

#### Initialize default data
This is how you provide default data to the store.
```typescript
import { Store } from '@quak.lib/qstore';

class MyStore extends Store<{ myData: string }> {
    constructor() {
        super({ myData: 'Hello world!' });
    }
}
```

#### Read data
This is how you can read data from the store.

```typescript
import {Store} from '@quak.lib/qstore';

class MyStore extends Store<{ myData: string }> {
    myData$ = this.select(state => state.myData);

    constructor() {
        super({myData: 'Hello world!'});
    }
}

@Component({
    selector: 'app-comment',
    template: `
    <div *ngIf="store.myData$ | async as myData">
        {{ myData }}
    </div>
    `
})
class Component {
    constructor(public store: MyStore) {}
}
```

#### Write data
This is how you can write data to the store.
```typescript
import { Store } from '@quak.lib/qstore';

class MyStore extends Store<{ myData: string }> {
    myData$ = this.select(state => state.myData);

    constructor() {
        super({ myData: 'Hello world!' });
    }

    setMyData(myData: string): void {
        this.set({ myData });
    }
}

class Component {
    constructor(public store: MyStore) {}
    
    onBtnClick(): void {
        this.store.setMyData('Hello world from component!');
    }
}
```

#### Pipe data
This is how you can pipe and mutate data from the store.

```typescript
import {Store} from '@quak.lib/qstore';
import {map} from 'rxjs/operators';

class MyStore extends Store<{ myData: string }> {
    myData$ = this.select(state => state.myData);

    myDataPiped$ = this.myData$.pipe(
        map(myData => myData.toUpperCase())
    )

    constructor() {
        super({myData: 'Hello world!'});
    }
}
```

### function Action
Action gives you some space where you can execute logic. It is a reactive data source, which means that you can subscribe to executions of your action.

Imagine that you need to execute some logic when user clicks on a button. You can do it in the following way:

```typescript
class Component {
    constructor(public store: MyStore) {}
    
    onBtnClick(): void {
        this.store.actions.yourAction.execute();
    }
}
```

With actions, you can listen to them in separate places in your application. You can do it in the following way:

```typescript
class SomeService {
    constructor(private store: MyStore) {
        this.store.actions.yourAction.listen().subscribe(() => {
            // Do something, it is very usefull when you want to execute some logic in multiple places.
        });
    }
}

class SomeComponent {
    constructor(private store: MyStore) {
        this.store.actions.yourAction.listen().subscribe(() => {
            // Do something, it is very usefull when you want to execute some logic in multiple places.
        });
    }
}
```

#### Initialize action
This is how you can initialize action in the store.

```typescript
import {Action, ActionWith, Store} from '@quak.lib/qstore';

class MyStore extends Store<{ myData: string }> {
    actions = {
        resetData: Action(),
        setMyData: ActionWith<string>()
    };
}
```

#### Listen to action executions
This is how you can listen to action executions.

```typescript
import {Action, ActionWith, Store} from '@quak.lib/qstore';

class MyStore extends Store<{ myData: string }> {
    myData$ = this.select(state => state.myData);

    actions = {
        resetData: Action(),
        setMyData: ActionWith<string>()
    };

    constructor() {
        super({myData: 'Hello world!'});
        this.actions.resetData.listen().subscribe(() => {
            this.setMyData('Hello world!');
        });
        this.actions.setMyData.listen().subscribe(payload => {
            this.setMyData(payload);
        });
    }

    private setMyData(myData: string): void {
        this.set({myData});
    }

}
```

#### Execute action
This is how you can execute action.

```typescript
import {Action, ActionWith, Store} from '@quak.lib/qstore';

class MyStore extends Store<{ myData: string }> {
    actions = {
        resetData: Action(),
        setMyData: ActionWith<string>()
    };
    // ...
}

class Component {
    constructor(private store: MyStore) {
        this.store.actions.resetData.execute();
        this.store.actions.setMyData.execute('Hello world!');
    }
}
```

## API
API for Qstore. You can find here all the information needed to work with Qstore interfaces.

### Store\<StoreState\>
Abstract class for store wrappers for your data. Extend this class to create your own store.

```typescript
abstract class Store<T> {
    protected constructor(initialState: T) {...}
    select<K>(mapFn: (state: T) => K): Observable<K> {...}
    set(state: Partial<T>): void {...}
    get values(): T {...}
}
```

#### constructor\<StoreState\>(initialState: StoreState)
Creates a new store with initial state.
```typescript
class MyStore extends Store<{ myData: string }> {
    constructor() {
        super({ myData: 'Hello world!' });
    }
}
```

#### select\<MappedTo\>(mapFn: (state: StoreState) => MappedTo): Observable\<MappedTo\>
Selects a slice of data from the store.
```typescript
class MyStore extends Store<{ myData: string }> {
    myData$ = this.select(state => state.myData);
    // ...
}
```

#### set(state: Partial\<StoreState\>): void
Pass partial state to the store. It will merge it with current state.
```typescript
class MyStore extends Store<{ myData: string }> {
    // ...
    setMyData(myData: string): void {
        this.set({ myData });
    }
}
```

#### get values(): StoreState
Returns current state of the store.
```typescript
class MyStore extends Store<{ myData: string }> {
    // ...
    getMyData(): string {
        return this.values.myData;
    }
}

class Component {
    constructor(private store: MyStore) {
        console.log(this.store.values.myData);
    }
}
```

### Action
Action is a function which can begin execution of some logic. It is a reactive data source, which means that you can subscribe to executions of your action.

```typescript
// Actions follows this interface
interface StoreEvent {
    execute: () => void;
    listen: () => Observable<void>;
}

class MyStore extends Store<{ myData: string }> {
    actions = {
        resetData: Action()
    };
    
    constructor() {
        super({ myData: 'Hello world!' });
        this.actions.resetData.listen().subscribe(() => {
            this.setMyData('Hello world!');
        });
    }
}

class Component {
    constructor(private store: MyStore) {
        this.store.actions.resetData.execute();
    }
}
```

### ActionWith\<Payload\>
Action execution may require some payload to be transferred.

```typescript
// Actions with payload follows this interface
export interface StoreEventWithPayload<P> {
    execute: (payload: P) => void;
    listen: () => Observable<P>;
}

class MyStore extends Store<{ myData: string }> {
    actions = {
        setMyData: ActionWith<string>()
    };

    constructor() {
        super({ myData: 'Hello world!' });
        this.actions.setMyData.listen().subscribe(payload => {
            this.setMyData(payload);
        });
    }
}

class Component {
    constructor(private store: MyStore) {
        this.store.actions.setMyData.execute('Hello component!');
    }
}
```

## Examples
Examples of how to use Qstore in your application.

### Angular

#### Basic usage
This is a very basic usage of Qstore in Angular application.

```typescript
import {Store} from '@quak.lib/qstore';
import {Component, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
class MyStore extends Store<{ myData: string }> {
    myData$ = this.select(state => state.myData);
    
    constructor() {
        super({myData: 'Hello world!'});
    }
    
    setMyData(myData: string): void {
        this.set({myData});
    }
}

@Component({
    selector: 'app-root',
    template: `
        <button (click)="setMyData('Hello world (click)!')">Set My Data</button>
        <div *ngIf="store.myData$ | async as myData">
            {{ myData }}
        </div>
    `
})
class Component {
    constructor(public store: MyStore) {}
    
    setMyData(text: string): void {
        this.store.setMyData(text);
    }
}
```

#### Simple store
This is a simple store with one action.

```typescript
import {Action, Store} from '@quak.lib/qstore';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
class MyStore extends Store<{ myData: string }> {
    actions = {
        resetData: Action()
    };

    constructor() {
        super({myData: 'Hello world!'});
        this.actions.resetData.listen().subscribe(() => {
            this.setMyData('Hello world!');
        });
    }

    private setMyData(myData: string): void {
        this.set({myData});
    }
}

class Component {
    constructor(private store: MyStore) {}
    
    resetData(): void {
        this.store.actions.resetData.execute();
    }
}

class AnotherComponent {
    constructor(private store: MyStore) {
        this.store.actions.resetData.listen().subscribe(() => {
            // Reset counter, or do something with business login, etc
        });
    }
}
```

#### Commands and queries
Commands and queries are two different types of behaviors. Commands are actions which change the state of the store. Queries selects slice of the state.

This patters is very useful when you want to separate business logic from the store, and make it more readable.

```typescript
import {Action, ActionWith, Store} from '@quak.lib/qstore';
import {Injectable} from '@angular/core';

const Command = (store: MyStore) => {
    return {
        setMyData: (myData: string) => store.set({myData}),
        resetData: () => store.set({myData: 'Hello world!'})
    };
}
const Query = (store: MyStore) => {
    return {
        myData$: store.select(state => state.myData)
    };
}

@Injectable({providedIn: 'root'})
class MyStore extends Store<{ myData: string }> {
    command = Command(this);
    query = Query(this);
    
    actions = {
        resetData: Action(),
        setMyData: ActionWith<string>()
    };

    constructor() {
        super({myData: 'Hello world!'});
        this.actions.resetData.listen()
            .subscribe(() => this.command.resetData());
        this.actions.setMyData.listen()
            .subscribe(payload => this.command.setMyData(payload));
    }
}

@Component({
    selector: 'app-root',
    template: `
        <button (click)="resetData()">Reset Data</button>
        <button (click)="setMyData('Hello world (click)!')">Set My Data</button>
        <div *ngIf="store.query.myData$ | async as myData">
            {{ myData }}
        </div>
    `
})
class Component {
    constructor(private store: MyStore) {}
    
    resetData(): void {
        this.store.actions.resetData.execute();
    }
    
    setMyData(text: string): void {
        this.store.actions.setMyData.execute(text);
    }
}
```

#### Strategy | How to append & group
This is a very common pattern in web applications. You have a list of items, and you want to append new items to the list, or group them by some criteria. This is an example of how to do it.

##### Diagram of the strategy
![Strategy diagram](https://quak.com.pl/assets/images/angular_strategy_example_tinified.png)

First we need to create a store which will hold the state of the list.

```typescript
import {ActionWith, Store} from '@quak.lib/qstore';
import {Injectable} from '@angular/core';

interface FlightReservationState {
    flightID: string;
    children: Child[];
    adults: Adult[];
    animals: Animal[];
}

@Injectable({providedIn: 'root'})
class FlightReservationStore extends Store<FlightReservationState> {
    actions = {
        setFlightID: ActionWith<string>(),
        appendPassenger: ActionWith<Child[] | Adult[] | Animal[]>(),
    };

    constructor() {
        super({flightID: '', children: [], adults: [], animals: []});
    }
}
```

Then we need to create a strategy which will handle the logic of appending and grouping.

```typescript
abstract class AppendPassengerStrategy {
    constructor(private store: FlightReservationStore) {}

    appendPassenger(passengers: Child[] | Adult[] | Animal[]): void {
        throw new Error('Not implemented');
    }
}
```

After creating base class we need to implement each logic separately.

```typescript
class AppendChildStrategy extends AppendPassengerStrategy {
    appendPassenger(passengers: Child[]): void {
        this.store.set({
            children: [...this.store.state.children, ...passengers]
        });
    }
}

class AppendAdultStrategy extends AppendPassengerStrategy {
    appendPassenger(passengers: Adult[]): void {
        this.store.set({
            adults: [...this.store.state.adults, ...passengers]
        });
    }
}

class AppendAnimalStrategy extends AppendPassengerStrategy {
    appendPassenger(passengers: Animal[]): void {
        this.store.set({
            animals: [...this.store.state.animals, ...passengers]
        });
    }
}
```

After we finish all the strategies, we need to create a factory which will return the correct strategy.

```typescript
class AppendPassengerStrategyFactory {
    static createStrategy(store: FlightReservationStore, passengers: Child[] | Adult[] | Animal[]): AppendPassengerStrategy {
        if (!passengers.length) {
            throw new Error('Passengers array is empty');
        }
        
        if (passengers[0] instanceof Child) {
            return new AppendChildStrategy(store);
        } else if (passengers[0] instanceof Adult) {
            return new AppendAdultStrategy(store);
        } else if (passengers[0] instanceof Animal) {
            return new AppendAnimalStrategy(store);
        } else {
            throw new Error('Unknown passengers type');
        }
    }
}
```

Then we need to polish it with listening and applying changes.

```typescript
import {ActionWith, Store} from '@quak.lib/qstore';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
class FlightReservationStore extends Store<FlightReservationState> {
    actions = {
        setFlightID: ActionWith<string>(),
        appendPassenger: ActionWith<Child[] | Adult[] | Animal[]>(),
    };

    constructor() {
        super({flightID: '', children: [], adults: [], animals: []});
    
        this.actions.setFlightID.listen()
            .subscribe(flightID => this.set({flightID}));
        
        this.actions.appendPassenger.listen()
            .subscribe(passengers => {
                const strategy = AppendPassengerStrategyFactory.createStrategy(this, passengers);
                strategy.appendPassenger(passengers);
            });
    }
}

class Component {
    constructor(private store: FlightReservationStore) {}
    
    setFlightID(flightID: string): void {
        this.store.actions.setFlightID.execute(flightID);
    }
    
    appendPassenger(passengers: Child[] | Adult[] | Animal[]): void {
        this.store.actions.appendPassenger.execute(passengers);
    }
}
```

#### Facade | Multi stores for a single feature
Another very common pattern in web applications. You have a feature which is using multiple stores. You want to create a facade which will be responsible for delegating the logic of the feature.

![FacadeExampleAngular](https://quak.com.pl/assets/images/angular_facade_example_tinified.png)

Create facade class.

```typescript
import {Store, Action, ActionWith} from '@quak.lib/qstore';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
class ProductsListFacade {
    get products$(): Observable<Product[]> {
        return this.list.products$;
    }
    
    get selectedProduct$(): Observable<Product> {
        return this.selected.selectedProduct$;
    }
    
    constructor(
        private list: ProductsListStore,
        private selected: SelectedProductStore,
    ) {}
    
    appendProduct(product: Product): void {
        this.list.actions.appendProduct.execute(product);
    }
    
    setProducts(products: Product[]): void {
        this.list.actions.setProducts.execute(products);
    }
    
    setSelectedProduct(product: Product): void {
        this.selected.actions.setSelectedProduct.execute(product);
    }
}
``` 

Then create inner stores.

```typescript
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
class SelectedProductStore extends Store<{selectedProduct: Product}> {
    actions = {
        setSelectedProduct: ActionWith<Product>(),
    };
    
    constructor() {
        super({selectedProduct: null});
        this.actions.setSelectedProduct.listen().subscribe(this.setSelectedProduct);
    }
    
    setSelectedProduct(product: Product): void {
        this.set({selectedProduct});
    }
}

@Injectable({providedIn: 'root'})
class ProductsListStore extends Store<{products: Product[]}> {
    actions = {
        getProducts: Action(),
        appendProduct: ActionWith<Product>(),
        setProducts: ActionWith<Product[]>(),
    };
    
    constructor() {
        super({products: []});
        
        this.actions.getProducts.listen()
            .subscribe(() => {
                // get products from API then...
                this.set({products});
            });
        
        this.actions.appendProduct.listen().subscribe(this.appendProduct);
        this.actions.setProducts.listen().subscribe(this.setProducts);
    }
    
    appendProduct(product: Product): void {
        this.set({products: [...this.state.products, product]});
    }
    
    setProducts(products: Product[]): void {
        this.set({products});
    }
}
```

## Generic stores
Generics are reusable store patterns. They are not required to use Qstore, but they can be very useful.

### SearchStore\<DataType, Filter\>
Search input + filters + outputList is one of the most common generic features in web applications.

This generic store can be used to implement easy, reactive search feature in your application.

```typescript
class SearchPagination {
    page: number;
    pageSize: number;

    constructor(defaultPage: number = 1, defaultPageSize: number = 10) {
        this.page = defaultPage;
        this.pageSize = defaultPageSize;
    }
}

interface SearchStoreState<DataType, Filter> {
    rows: DataType[];
    total: number;
    filter: Filter;
    pagination: SearchPagination;
    isLoading: boolean;
}

class SearchStore<StoreState, DataType, Filter> extends Store<StoreState extends SearchStoreState<DataType, Filter>> {
    rows$ = this.select(state => state.rows);
    total$ = this.select(state => state.total);
    filter$ = this.select(state => state.filter);
    pagination$ = this.select(state => state.pagination);
    isLoading$ = this.select(state => state.isLoading);

    constructor(initialState: SearchStoreState<DataType, Filter>) {
        super({ ...initialState });
    }

    setRows(rows: DataType[]): void {
        this.update({ rows });
    }
    setTotal(total: number): void {
        this.update({ total });
    }
    updateFilter(filter: Partial<Filter>): void {
        this.update({ filter: { ...this.values.filter, ...filter } });
    }
    resetFilter(): void {
        this.update({ filter: new Filter() });
    }
    updatePagination(pagination: Partial<SearchPagination>): void {
        this.update({ pagination: {...this.values.pagination, ...pagination} });
    }
    resetPagination(): void {
        this.update({ pagination: new SearchPagination() });
    }
    setLoading(isLoading: boolean): void {
        this.update({ isLoading });
    }
}
```

### SearchStore\<DataType, Filter\> usage example in Angular
```typescript
import {Injectable} from '@angular/core';
import {combineLatest} from 'rxjs';
import {ActionWith} from '@quak.lib/qstore';
import {SearchPagination, SearchStore, SearchStoreState} from '@quak.lib/qstore/generics';

interface Flight {
    id: string;
    // ...
}

class FlightFilter {
    searchPhrase: string;
    city: string;
    // ...

    constructor(initialValues?: Partial<FlightFilter>) {
        this.searchPhrase = initialValues?.searchPhrase ?? '';
        this.city = initialValues?.city ?? '';
        // ...
    }
}

interface FlightSearchStoreState extends SearchStoreState<Flight, FlightFilter> {
    selectedFlightId: string;
}

@Injectable({ providedIn: 'root' })
class FlightSearchStore extends SearchStore<FlightSearchStoreState, Flight, FlightFilter> {
    actions = {
        fetchFlights: ActionWith<{ filter: FlightFilter, pagination: SearchPagination }>(),
        updateFilter: ActionWith<{ filter: Partial<FlightFilter> }>(),
        updatePagination: ActionWith<{ pagination: Partial<SearchPagination> }>(),
        selectFlight: ActionWith<{ flightId: string }>(),
    }

    // Additional store selectors
    selectedFlightId$ = this.select(state => state.selectedFlightId);
    
    constructor(private flightRepository: FlightRepository) {
        super(DEFAULT_STATE());
        
        const { onFetchFlights$, onUpdateFilter$, onUpdatePagination$, onSelectFlight$ } = this.getStoreActions();
        onSelectFlight$.subscribe(({ flightId }) => this.selectFlight(flightId));
        onUpdateFilter$.subscribe(({ filter }) => this.updateFilter(filter));
        onUpdatePagination$.subscribe(({ pagination }) => this.updatePagination(pagination));
        onFetchFlights$.subscribe(({rows, total}) => this.set({
            rows: [...this.values.rows, ...flights],
            total,
            isLoading: false,
        }));
    }
    
    private selectFlight(flightId: string): void {
        this.set({selectedFlightId: flightId});
    }
    
    private updateFilter(filter: Partial<FlightFilter>): void {
        this.set({filter: {...this.values.filter, ...filter}});
        this.actions.fetchFlights.execute({filter, pagination: this.values.pagination});
    }
    
    private updatePagination(pagination: Partial<SearchPagination>): void {
        this.set({pagination: {...this.values.pagination, ...pagination}});
        this.actions.fetchFlights.execute({filter: this.values.filter, pagination});
    }
    
    private resetFilter(): void {
        this.set({filter: new FlightFilter()});
        this.actions.fetchFlights.execute({filter: new FlightFilter(), pagination: this.values.pagination});
    }
    
    private resetPagination(): void {
        this.set({pagination: new SearchPagination()});
        this.actions.fetchFlights.execute({filter: this.values.filter, pagination: new SearchPagination()});
    }
    
    private getStoreActions() {
        const onSelectFlight$ = this.actions.selectFlight.listen();
        const onUpdateFilter$ = this.actions.updateFilter.listen();
        const onUpdatePagination$ = this.actions.updatePagination.listen();
        const onFetchFlights$ = this.actions.fetchFlights.listen()
            .pipe(
                switchMap(({ filter, pagination }) => {
                    this.setLoading(true);
                    return this.flightRepository.fetch(filter, pagination);
                })
            );
        return { onSelectFlight$, onUpdateFilter$, onUpdatePagination$, onFetchFlights$ };
    }
    
}

function DEFAULT_STATE(): FlightSearchStoreState {
    return {
        rows: [],
        filter: new FlightFilter(),
        pagination: new SearchPagination(),
        total: 0,
        isLoading: false,
        selectedFlightId: null,
    };
}
```

## License

[MIT LICENSE](https://github.com/Walikuperek/Qtheme/blob/master/LICENSE)

Made & maintained with ❤️ by [QUAK](https://quak.com.pl)
