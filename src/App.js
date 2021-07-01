import { useEffect, useState } from "react";
import "./App.css";
import db from "./firebase";
import Loader from "react-loader-spinner";

function Login({ onClick, onChange, value }) {
  return (
    <div className="Login">
      <div className="Login-container">
        <h2>Admin Seakun</h2>
        <input
          value={value}
          onChange={onChange}
          placeholder="masukan nama"
          className="Login-input"
        />
        <div onClick={onClick} className="Login-button">
          <span>Login</span>
        </div>
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="Login">
      <div className="Login-container">
        <Loader height={100} color="#8DCABE" type="Circles" />
      </div>
    </div>
  );
}

function App() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState({});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [login, setLogin] = useState(false);
  const [adminId, setAdminId] = useState();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("user"));
    if (admin) {
      setLogin(admin.login);
      setName(admin.name);
      setAdminId(admin.id);
    }
  }, [loading]);

  function onLogin() {
    if (name !== "") {
      const admin = {
        login: true,
        id: name.replace(/\s/g, ""),
        name: name,
      };
      localStorage.setItem("user", JSON.stringify(admin));
      setLoading(true);
      db.collection("admins")
        .doc(name.replace(/\s/g, ""))
        .set({
          id: name.replace(/\s/g, ""),
          name: name,
        })
        .then(() => {
          setTimeout(() => {
            setLoading(false);
            setLogin(true);
          }, 2000);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  useEffect(() => {
    let list = [];
    const subscribe = db.collection("users").onSnapshot((data) => {
      data.forEach((docs) => {
        const { id, name } = docs.data();
        list.push({ id, name });
      });
      setUsers(list);
    });
    return () => subscribe();
  }, []);

  useEffect(() => {
    const subscribe = db
      .collection("chats")
      .orderBy("date")
      .onSnapshot((snapshoot) => {
        let list = [];
        snapshoot.forEach((doc) => {
          const { message, senderId, recipientId, date } = doc.data();
          if (
            (senderId === userId.id || senderId === adminId) &&
            (recipientId === userId.id || recipientId === adminId)
          )
            list.push({
              message,
              senderId,
              recipientId,
              date,
            });
        });
        setMessages(list);
      });
    return () => subscribe();
  }, [userId, adminId]);

  function onEnterPress(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      if (input !== "") {
        db.collection("chats").add({
          message: input,
          senderId: adminId,
          recipientId: userId.id,
          date: new Date().getTime(),
        });
      }
      setInput("");
    }
  }

  function onLogout() {
    localStorage.clear();
    setLoading(true);
    setLogin(false);
    setAdminId();
    setName("");
    setUserId({});
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {!login ? (
        <Login
          onClick={() => onLogin()}
          value={name}
          onChange={(v) => setName(v.target.value)}
        />
      ) : (
        <div className="App">
          <div className="App-body">
            <div className="Sidebar">
              <div className="Header-Sidebar">
                <span className="Title-Sidebar">{name}</span>
              </div>
              <div className="Sidebar-User">
                {users.map((item, index) => {
                  return (
                    <div
                      onClick={() => setUserId(item)}
                      key={index}
                      className="Sidebar-Card"
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="Chatscreen">
              <div className="Chatscreen-header">
                <span className="Title-Sidebar">{userId.name}</span>
                <span onClick={onLogout} className="Logout">
                  Logout
                </span>
              </div>
              <div className="Chatscreen-body">
                {messages.map((item) => (
                  <div
                    className={`Chatscreen-message ${
                      item.senderId === name.replace(/\s/g, "") && "Chat-sender"
                    }`}
                  >
                    {item.message}
                  </div>
                ))}
              </div>
              <div className="Chatscreen-footer">
                <form>
                  <textarea
                    required
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message"
                    type="text"
                    rows="1"
                    onKeyDown={onEnterPress}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
