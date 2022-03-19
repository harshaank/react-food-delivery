import {gql, useMutation} from '@apollo/client';
import {useForm} from 'react-hook-form';
import {loginMutation, loginMutationVariables} from '../types/LoginMutation';
import InputError from '../components/input-error';
import logo from '../assets/img/logo.png';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const {register, handleSubmit, formState} = useForm<LoginForm>();
  const {email, password} = formState.errors;
  const [loginMutation, {data: loginMutationResult, loading}] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  function onCompleted(data: loginMutation): void {
    const {ok, token} = data.login;
    if (ok) {
      console.log(token);
    }
  }

  function onSubmit(data: LoginForm) {
    if (!loading) {
      const {email, password} = data;
      loginMutation({
        variables: {
          loginInput: {email, password},
        },
      });
    }
  }

  return (
    <div className='flex h-screen flex-col items-center'>
      <div className='w-full max-w-md rounded-lg bg-white py-20'>
        <div className='mb-8 text-center'>
          <img src={logo} alt='Food Delivery' width='80' className='inline-block' />
          <h1 className='mb-1 text-3xl text-gray-800'>
            Food <span className='font-medium text-green-500'>Delivery</span>
          </h1>
          <p>Bienvenido de nuevo</p>
        </div>
        {loginMutationResult?.login.error && (
          <InputError message={loginMutationResult?.login.error} />
        )}
        <form onSubmit={handleSubmit(onSubmit)} className='mb-5 grid gap-5 px-10'>
          <div>
            <input
              {...register('email', {required: 'El correo electrónico es requerido'})}
              name='email'
              type='email'
              required
              placeholder='Correo electrónico'
              className='input'
            />
            {email?.message && <InputError message={email?.message} />}
          </div>
          <div>
            <input
              {...register('password', {required: 'La contraseña es requerida', minLength: 6})}
              type='password'
              placeholder='Contraseña'
              required
              className='input'
            />
            {password?.message && <InputError message={password?.message} />}
            {password?.type === 'minLength' && (
              <InputError message='La contraseña debe tener al menos 6 caracteres' />
            )}
          </div>
          <button type='submit' className='btn'>
            {loading ? 'Cargando...' : 'Acceder'}
          </button>
        </form>
        <p className='text-center text-sm'>
          ¿Eres nuevo por aqui? <span className='text-green-500'>Crea un cuenta</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
