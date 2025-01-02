import { Command } from "commander";

export function makeAuthCommand() {
  const auth = new Command("auth");

  auth
    .command("login")
    .description("login to the server")
    .action(() => {
      const code = Math.floor(Math.random() * 100);

      console.log(`logging in with code: ${code}`);

      console.log(
        `Open browser and navigate to: http://localhost:3000?code=${code}`,
      );
    });

  auth
    .command("logout")
    .description("logout from the server")
    .action(() => {
      console.log("logging out");
    });

  auth
    .command("whoami")
    .description("get the current logged in user")
    .action(() => {
      console.log("you are logged in as: user");
    });

  return auth;
}
