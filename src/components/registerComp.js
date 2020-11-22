import React, { useRef, useState, useEffect, useCallback } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../context/authContext";
import { Link, useHistory } from "react-router-dom";
import { database } from "../firebase";
export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const isMounted = useRef(true);
  const { signup } = useAuth();
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

      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        return setError("Passwords do not match");
      }
      if (loading) return;
      setLoading(true);
      try {
        setError("");
        await signup(emailRef.current.value, passwordRef.current.value).then(
          async function (result) {
            await database.ref("/admins/" + result.user.uid).set({
              mail: result.user.email,
              createdAt: Date.now(),
            });
          }
        );
        history.push("/");
      } catch {
        setError("Failed to create an account");
        setLoading(false);
      }
      if (isMounted.current) setLoading(false);
    },
    [loading, history, signup]
  );

  return (
    <div className="App-container">
      <div>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control type="password" ref={passwordConfirmRef} required />
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
              <>Sign Up</>
            )}
          </Button>
        </Form>
      </div>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </div>
  );
}
