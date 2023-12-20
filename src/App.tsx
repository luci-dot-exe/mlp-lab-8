import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Container, Navbar } from "react-bootstrap";
import { useMemo, useState } from "react";

function App() {
  return (
    <div>
      <HashRouter>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand href="/">MLP - Lab 8</Navbar.Brand>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

function Homepage() {
  const navigate = useNavigate();

  const students = useMemo(getStudents, []);

  return (
    <div className="container">
      <h1>Alunos</h1>

      <Spacer />

      <Button label="Cadastrar" onClick={() => navigate("register")} />

      <Spacer />

      <List
        emptyMessage="Nenhum aluno cadastrado"
        items={students.map((s) => ({ text: s.name }))}
      />
    </div>
  );
}

type Student = { name: string };

function getStudents(): Student[] {
  const dataStored = window.localStorage.getItem("students");

  if (dataStored === null) {
    return [];
  }

  const result = tryParseJSON(dataStored);

  if (!result.ok) {
    return [];
  }

  if (!Array.isArray(result.value)) {
    return [];
  }

  // TODO: Handle invalid JSONs

  return result.value;
}

function tryParseJSON(text: string): { ok: false } | { ok: true; value: any } {
  try {
    const value = JSON.parse(text);
    return { ok: true, value };
  } catch {
    return { ok: false };
  }
}

function List({
  items,
  emptyMessage,
}: {
  items: { text: string }[];
  emptyMessage: string;
}) {
  if (items.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="list-group">
      {items.map((item, index) => (
        <li className="list-group-item" key={index}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}

function Button({ label, onClick }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="btn btn-primary" onClick={onClick}>
      {label}
    </button>
  );
}

function Spacer() {
  return <div style={{ marginBottom: 8 }}></div>;
}

function Register() {
  const [state, setState] = useState("");

  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Cadastrar aluno</h1>

      <div className="mb-3">
        <label htmlFor="exampleFormControlInput1" className="form-label">
          Nome
        </label>
        <input
          type="email"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Anderson"
          value={state}
          onChange={(ev) => setState(ev.target.value)}
        />
      </div>

      <Button
        label="Cadastrar"
        onClick={() => {
          localStorage.setItem("students", JSON.stringify([{ name: state }]));
          navigate("/");
        }}
      />
    </div>
  );
}
export default App;
