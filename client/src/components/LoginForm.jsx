// importing usestate from react to manage component state
import { useState } from 'react';
// importing use mutation from apollo to handle the graphql mutation
import { useMutation } from '@apollo/client';
import { Form, Button, Alert } from 'react-bootstrap';
// importing the login user mutation from the mutation folder
import { LOGIN_USER } from '../utils/mutations';  
import Auth from '../utils/auth';

// creating the login form component
const LoginForm = () => {
  // creating state for the form fields
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // creating state for the alert message
  const [validated] = useState(false);
  // creating state for the alert message
  const [showAlert, setShowAlert] = useState(false);

  // creating a mutation hook to handle the login user mutation
  const [loginUser, { error }] = useMutation(LOGIN_USER);

  // creating a function to handle the change in the form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // creating a function to handle the form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    //try to login the user using the login user mutation
    try {
      const { data } = await loginUser({
        variables: { ...userFormData }
      });

      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
