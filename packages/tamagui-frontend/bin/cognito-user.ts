import { env } from '../src/services/Configuration';

const {
  Region: region,
  UserPoolClientId: clientId,
  UserPoolId: userPoolId,
} = env;

const email = process.env['EMAIL'] || null;
const password = process.env['PASSWORD'] || null;

if (email && password) {
  //aws cognito-idp sign-up               --region  --client-id     --username  --password 
  const signUp = Bun.spawn(['aws', 'cognito-idp', 'sign-up', '--region', region, '--client-id', clientId, '--username', email, '--password', password]);
  const output1 = await new Response(signUp.stdout).text();

  console.log(`created account: ${email}`);
  // console.log(output1);

  //aws cognito-idp admin-confirm-sign-up --region  --user-pool-id  --username 
  const adminConfirmSignUp = Bun.spawn(['aws', 'cognito-idp', 'admin-confirm-sign-up', '--region', region, '--user-pool-id', userPoolId, '--username', email]);
  const output2 = await new Response(signUp.stdout).text();

  console.log(`confirmed account: ${email}`);
  // console.log(output2);

  process.exit();
}



console.log('email', email);
console.log('password', password);

console.log('usage: EMAIL="email@example.com" PASSWORD="ASdf1234$" bun run cognito:user');
