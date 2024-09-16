import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className='formCon'>
      <h1 className='inputTitle'>Log In</h1>
      <form onSubmit={handleSubmit}>
      <div className='inputCon'>
        <label><p className='labelTitle'>Username or Email</p></label>
        <input
          className='formInput'
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </div>
      <div className='inputCon'>
        <label className='labelTitle'>Password</label>
        <input
          className='formInput'
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
        
        {errors.credential && (
          <p className='labelTitle error'>{errors.credential}</p>
        )}
        <button 
        className='submitButton'
          type="submit" 
          disabled={(credential.length < 4 || password.length < 4)}
        >Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;