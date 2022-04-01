describe('login', () => {
  const emailInput = 'input[name=email]';
  const passwordInput = 'input[name=password]';
  const submitButton = 'button[type=submit]';
  const user = cy;

  it('should go to login page', () => {
    user.visit('http://localhost:3000').title().should('eq', 'Iniciar sesión | Food Delivery');
  });

  it('can see email / password validation errors', () => {
    user
      .visit('/')
      .get(emailInput)
      .type('fail@mail')
      .get(passwordInput)
      .type('123')
      .get(submitButton)
      .click();
    user.findAllByRole('alert').eq(0).should('have.text', 'Ingresa un correo válido');
    user.get(emailInput).clear();
    user.findAllByRole('alert').eq(0).should('have.text', 'El correo es requerido');
    user
      .findAllByRole('alert')
      .eq(1)
      .should('have.text', 'La contraseña debe tener al menos 6 caracteres');
    user.get(passwordInput).clear();
    user.findAllByRole('alert').eq(1).should('have.text', 'La contraseña es requerida');
  });

  it('get the token and access', () => {
    user
      .visit('/')
      .get(emailInput)
      .type('test@mail.com')
      .get(passwordInput)
      .type('secret')
      .get(submitButton)
      .click();
    user.window().its('localStorage.fd-token').should('be.a', 'string');
  });
});
