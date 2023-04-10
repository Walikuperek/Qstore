import {Store} from './store';
import {Action, ActionWith} from './action';

class TestStore extends Store<{todos: string[]}> {
    todos$ = this.select(state => state.todos);
    
    actions = {
        resetTodos: Action(),
        setTodos: ActionWith<{todos: string[]}>(),
    }

    constructor() {
        super({todos: []});
        this.actions.resetTodos.listen().subscribe(() => this.set({todos: []}));
        this.actions.setTodos.listen().subscribe(({todos}) => this.set({todos}));
    }

    setTodos(todos: string[]): void {
        this.set({todos});
    }
}

describe('store', () => {
    const store = new TestStore();
    
    it('should init store', () => {
        const store = new TestStore();
        expect(store.values).toEqual({todos: []});
    });

    it('should set todos', () => {
        store.setTodos(['todo1', 'todo2']);
        expect(store.values).toEqual({todos: ['todo1', 'todo2']});
    });

    it('should select current todos', () => {
        store.setTodos(['todo1', 'todo2']);
        expect(store.values.todos).toEqual(['todo1', 'todo2']);
    });

    it('should select current todos with observable', () => {
        store.setTodos(['todo1', 'todo2']);
        store.todos$.subscribe(todos => expect(todos).toEqual(['todo1', 'todo2']));
    });

    it('should reset todos', () => {
        store.setTodos(['todo1', 'todo2']);
        store.actions.resetTodos.execute();
        expect(store.values).toEqual({todos: []});
    });
});
