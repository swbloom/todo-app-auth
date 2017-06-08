import React from 'react';
import ReactDOM from 'react-dom';

// 1. Set up our firebase database
var config = {
   apiKey: "AIzaSyB24fqu5tbjjKQlqIxGugscwZpXpJHrj3Y",
   authDomain: "todoapp-44275.firebaseapp.com",
   databaseURL: "https://todoapp-44275.firebaseio.com",
   projectId: "todoapp-44275",
   storageBucket: "todoapp-44275.appspot.com",
   messagingSenderId: "846016065931"
 };
 firebase.initializeApp(config);

const auth = firebase.auth();
const authProvider = new firebase.auth.GoogleAuthProvider();
const dbRef = firebase.database().ref('/');

// 3. Create input and button inside of our App component so that user can type in their todo
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			currentTodo: '',
			todos: [],
			loggedIn: false
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}
	handleSubmit(e) {
		e.preventDefault();
		dbRef.push(this.state.currentTodo);
		this.setState({
			currentTodo: '',
		});
	}
	login() {
		auth.signInWithPopup(authProvider)
			.then((result) => {
				var user = result.user;
				this.setState({
					loggedIn: true,
					user: user
				});			
			});
	}
	logout() {
		auth.signOut().then(() => {
			this.setState({
				loggedIn: false,
				user: {}
			})
		});
	}
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	removeTodo(key) {
		const todoRef = firebase.database().ref(key);
		todoRef.remove();
	}
	render() {
		const showTodos = () => {
			if (this.state.loggedIn === true) {
				return (<div>
					<button onClick={this.logout}>Log Out</button>
					<form onSubmit={this.handleSubmit}>
						<input name="currentTodo" value={this.state.currentTodo} onChange={this.handleChange} type="text" placeholder="Enter your todo" />
						<input type="submit" value="Add Todo" />
					</form>
					<ul>
						{this.state.todos.map((todo) => {
							return (<li key={todo.key}>
								{todo.description}
								<button onClick={() => this.removeTodo(todo.key)}>🙅</button>
							</li>)	
						})}
					</ul>
				</div>)
			} else {
				return (<div>
					<button onClick={this.login}>Login</button>
					You must be logged in to see or add todos.
				</div>)
			}
		}
		return (
			<main>
				<h1>Todo App</h1>
				{showTodos()}
			</main>
		)
	}
	componentDidMount() {
		auth.onAuthStateChanged((user) => {
			if (user) {
				this.setState({
					loggedIn: true
				});
			}
		});
		dbRef.on('value', (snapshot) => {
			const dbTodos = snapshot.val();
			const newTodos = [];
			for (let key in dbTodos) {
				// console.log('key', key);
				// console.log('todos', dbTodos[key]);
				newTodos.push({
					key: key,
					description: dbTodos[key] 
				});
			}
			// console.log(newTodos);
			this.setState({
				todos: newTodos
			});
		});
	}
}

ReactDOM.render(<App />, document.getElementById('app'));


// 4. Record whatever they type in into the state of our app
// 5. Add a 'Add Todo' button that sends our todo to firebase 🔥🔥🔥
// 6. Grab data from firebase (ID of the todo and the todo name) and store it in our state
// 7. Display the todos on the page
// 8. Remove a single todo from the page