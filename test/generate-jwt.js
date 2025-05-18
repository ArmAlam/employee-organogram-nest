const { JwtService } = require('@nestjs/jwt');

async function generateToken() {
  const jwtService = new JwtService({ secret: 'secret' });
  const payload = { username: 'CTO', sub: 1 };
  const token = jwtService.sign(payload);
  console.log(token);
}

generateToken();
