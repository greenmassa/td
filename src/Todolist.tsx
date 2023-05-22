
import { useState, useEffect } from 'react';
import './App.css';
import './fonts.css';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Array<Todo>>([]);
    const [newTodo, setNewTodo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [editTodoId, setEditTodoId] = useState<number | null>(null);
    const [editedTodoText, setEditedTodoText] = useState('');
    const [sortType, setSortType] = useState<boolean>(true);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((response) => response.json())
            .then((data) => setTodos(data));
    }, []);

    const addTodo = () => {
        const todo = {
            id: todos.length + 2,
            title: newTodo,
            completed: false,
        };
        setTodos([...todos, todo]);
        setNewTodo('');
    };

    const deleteTodo = (id: number) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
    };

    const completeTodo = (id: number) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        setTodos(updatedTodos);
    };

    const startEditingTodo = (id: number, title: string) => {
        setEditTodoId(id);
        setEditedTodoText(title);
    };

    const cancelEditingTodo = () => {
        setEditTodoId(null);
        setEditedTodoText('');
    };

    const saveEditedTodo = (id: number) => {
        const updatedTodos = todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, title: editedTodoText };
            }
            return todo;
        });
        setTodos(updatedTodos);
        setEditTodoId(null);
        setEditedTodoText('');
    };

    const searchTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filterTodos = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value);
    };

    const sortTodos = () => {
        const type = !sortType;
        setSortType(type);
        const sortedTodos = [...todos];
        sortedTodos.sort((a, b) => {
            if (sortType) {
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
        setTodos(sortedTodos);
    };


    const filteredTodos = [...todos].filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const finalTodos = filter ? filteredTodos.filter((todo) => todo.completed.toString() === filter) : filteredTodos;

    return (
        <div className="todo-list">
            <h1>Todo Лист</h1>
            <div className="todo-header">
                <div className="todo-input">
                    <input type="text" value={newTodo} onChange={(event) => setNewTodo(event.target.value)} />
                    <button onClick={addTodo}>Добавить задачу</button>
                </div>
                <div className="filter-sort-search">
                    <input type="text" placeholder="Search Todo" value={searchTerm} onChange={searchTodo} />
                    <select value={filter} onChange={filterTodos}>
                        <option value="">Все</option>
                        <option value="true">Завершенные</option>
                        <option value="false">Незавершенные</option>
                    </select>

                    <button onClick={sortTodos}>
                        {sortType ? 'от Я до А' : 'от A до Я'}
                    </button>
                </div>
            </div>

            <div>
                {finalTodos.map((todo) => (
                    <div key={todo.id} className="todo-item">
                        {editTodoId === todo.id ? (
                            <>
                                <div className="todo-body">
                                    <input className="edit-todo-input" type="text" value={editedTodoText} onChange={(event) => setEditedTodoText(event.target.value)} />
                                </div>
                                <div className="controls">
                                    <button onClick={() => saveEditedTodo(todo.id)}>Сохранить</button>
                                    <button onClick={cancelEditingTodo}>Отмена</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="todo-body">
                                    <input type="checkbox" checked={todo.completed} onChange={() => completeTodo(todo.id)} />
                                    <div className="todo-text"> {todo.title}</div>
                                </div>
                                <div className="controls">
                                    <button onClick={() => startEditingTodo(todo.id, todo.title)}>Ред.</button>
                                    <button onClick={() => deleteTodo(todo.id)}>Удалить</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;