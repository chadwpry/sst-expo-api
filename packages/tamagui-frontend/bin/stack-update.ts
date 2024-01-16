import { env } from '../src/services/Configuration';

const {
  Region: region,
  UserPoolClientId: clientId,
  UserPoolId: userPoolId,
} = env;

const username = String(process.env['USERNAME']);
const password = String(process.env['PASSWORD']);

if (username.length === 0 || password.length === 0) {
  console.log('error: update the environment variables in the stack:update script (hint: package.json)');
  process.exit();
}
//aws cognito-idp sign-up               --region  --client-id     --username  --password 
const signUp = Bun.spawn(['aws', 'cognito-idp', 'sign-up', '--region', region, '--client-id', clientId, '--username', username, '--password', password]);
const output1 = await new Response(signUp.stdout).text();

console.log(`created account: ${username}`);
console.log(output1);

//aws cognito-idp admin-confirm-sign-up --region  --user-pool-id  --username 
const adminConfirmSignUp = Bun.spawn(['aws', 'cognito-idp', 'admin-confirm-sign-up', '--region', region, '--user-pool-id', userPoolId, '--username', username]);
const output2 = await new Response(signUp.stdout).text();

console.log();
console.log(`confirmed account: ${username}`);
console.log(output2);
