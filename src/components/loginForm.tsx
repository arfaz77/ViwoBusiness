import { createSignal } from 'solid-js';
import { createForm } from '@felte/solid';
import { validator } from '@felte/validator-yup';
import * as yup from 'yup';
import { login } from '../utils/auth';


const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password required'),
});

const LoginForm = () => {
  const [loading, setLoading] = createSignal(false);
  const [errorMsg, setErrorMsg] = createSignal('');

  const { form, errors } = createForm({
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await login(values.email, values.password);
        
        if (response.user) {
          // Redirect based on user role
          const redirectPath = response.user.role === 'admin' 
            ? '/'
            : response.user.role === 'moderator'
            ? '/'
            : '/';
            
          window.location.href = redirectPath;
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Login failed');
      } finally {
        setLoading(false);
      }
    },
    extend: validator({ schema }),
  });

  return (
    <div class="flex justify-center w-1/2 items-center px-16">
       <form
        use:form
        class="bg-white shadow-md rounded-2xl px-8 pt-6 pb-2 mb-2 w-fit h-96"
      >
        <h2 class="text-2xl font-bold mb-6 text-center">Welcome!</h2>
        
        {errorMsg() && (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {errorMsg()}
          </div>
        )}
 <div class="relative">
        <div class="pl-4 absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <img class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" src="/mailbox.png" alt="icon"/>
        </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            class="block px-8 py-3 w-full text-sm text-gray-900
             bg-transparent rounded-3xl border border-gray-300 appearance-none
              outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="email@gmail.com"
          />
          

          <label
            for="email"
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2  peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
          >
            Email
          </label>
          {errors().email && (
            <span class="text-red-500 text-sm">{errors().email}</span>
          )}
        </div>

        {/* <div class="relative mt-4"> */}
        <div class="relative mt-6">
        <div class="pl-4 absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <img class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" src="/password.png" alt="icon"/>
        </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="block px-8 py-3 w-full text-sm text-gray-900 bg-transparent rounded-3xl border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="Enter your password"
          />
          <label
            for="password"
            class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2  peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
          >
            Password
          </label>
          {errors().password && (
            <span class="text-red-500 text-sm">{errors().password}</span>
          )}
        </div>

        
          <p class="w-fit place-self-end pr-2 mt-2 text-xs text-gray-500">Forgot Password?</p>
        

        <div class="flex items-center justify-between mt-16">
          <button
            type="submit"
            disabled={loading()}
            class="bg-orange-500 hover:bg-orange-700 text-white font-bold pb-2.5 pt-4 px-32 rounded-3xl focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading() ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;