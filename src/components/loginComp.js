import React, { useRef, useState, useEffect, useCallback } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { Link, useHistory } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const isMounted = useRef(true);
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;
      setLoading(true);
      try {
        setError("");
        await login(emailRef.current.value, passwordRef.current.value);
        history.push("/");
      } catch {
        setError("Failed to log in");
        setLoading(false);
      }

      if (isMounted.current) setLoading(false);
    },
    [loading, history, login]
  );

  return (
    <div className="App-container">
      <div className="App-card">
        <h1 className="text-center mb-4">Log In</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              className="App-input"
              type="email"
              ref={emailRef}
              required
            />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            {loading ? (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <>Log In</>
            )}
          </Button>
        </Form>
      </div>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
}
