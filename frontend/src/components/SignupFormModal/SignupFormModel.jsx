import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal({navigate}) {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  // const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .then(() => navigate('/'))
        .catch(async (res) => {
          const err = await res.json();
          if (err) {
              if (err.errors) {
                  setErrors(err.errors);
              } else {
                  if (err.stack) delete err.stack;
                  setErrors(err)
              }
          }
      });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='formCon'>
      <h1 className='inputTitle'>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className='inputCon'>
          <label>
            <p className='labelTitle'>Email</p>
          </label>
          <input
            className='formInput'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className='labelTitle error'>{errors.email}</p>}
        </div>
        {/* Username */}
        <div className='inputCon'>
          <label>
            <p className='labelTitle'>
              Username
            </p>
          </label>
          <input
            className='formInput'
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className='labelTitle error'>{errors.username}</p>}
        </div>
        {/* First Name */}
        <div className='inputCon'>
          <label>
            <p className='labelTitle'>
              First Name
            </p>
          </label>
          <input
            className='formInput'
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && <p className='labelTitle error'>{errors.firstName}</p>}
        </div>
        {/* Last Name */}
        <div className='inputCon'>
          <label>
            <p className='labelTitle'>Last Name</p>
          </label>
          <input
            className='formInput'
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && <p className='labelTitle error'>{errors.lastName}</p>}
        </div>
        {/* Password */}
        <div className='inputCon'>
          <label>
            <p className='labelTitle'>Password</p>
          </label>
          <input
            className='formInput'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className='labelTitle error'>{errors.password}</p>}
        </div>
        {/* Confirm Password */}
        <div className='inputCon'>
          <label>
            <p className='labelTitle'>Confirm Password</p>
          </label>
          <input
            className='formInput'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <p className='labelTitle error'>{errors.confirmPassword}</p>
          )}
        </div>
        
        <button 
          className='submitButton'
          type="submit"
          disabled={
            (!email.length ||
            !username.length ||
            !firstName.length ||
            !lastName.length ||
            !password.length ||
            !confirmPassword.length)
          }
          >Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;